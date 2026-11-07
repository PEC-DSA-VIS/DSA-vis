// Complete Production-Hardened Authentication Handler for AlgoViz
// Implements Student & Admin authentication, Email OTP verification, PBKDF2 (210k iterations),
// Brute-force rate limiting, and Atomic Database Storage.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendOtpEmail } from './emailService.js';
import {
  saveStudentToDb,
  findStudentByIdentifierFromDb,
  saveAdminToDb,
  getAdminFromDb,
  saveSessionToDb,
  deleteSessionFromDb,
  getAllStudentsFromDb,
  logAuthEventToDb,
  isMongoConnected,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'auth_store.json');
const STORE_TMP_FILE = path.join(DATA_DIR, 'auth_store.json.tmp');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

// OWASP Recommended PBKDF2 Password Hashing (210,000 iterations with SHA-512)
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512').toString('hex');
}

// Generate new unique salt
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Load Persistent Store
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      const store = JSON.parse(data);
      let needsSave = false;
      // Ensure default demo student has password if missing
      if (store.students?.['COL-2024-CSE-042'] && !store.students['COL-2024-CSE-042'].passwordHash) {
        const studentSalt = generateSalt();
        store.students['COL-2024-CSE-042'].salt = studentSalt;
        store.students['COL-2024-CSE-042'].passwordHash = hashPassword('Student@123', studentSalt);
        store.students['COL-2024-CSE-042'].name = store.students['COL-2024-CSE-042'].name || 'Rahul Sharma';
        needsSave = true;
      }
      // Upgrade any legacy 10k static_salt admin to 210k with unique salt
      if (store.admins?.['admin@college.edu'] && store.admins['admin@college.edu'].salt === 'static_salt') {
        const newSalt = generateSalt();
        store.admins['admin@college.edu'].salt = newSalt;
        store.admins['admin@college.edu'].passwordHash = hashPassword('Admin@12345', newSalt);
        needsSave = true;
      }
      if (needsSave) {
        saveStore(store);
      }
      return store;
    }
  } catch (err) {
    console.error('[AUTH STORE] Error reading store, initializing fresh:', err);
  }

  const defaultAdminSalt = generateSalt();
  const freshStore = {
    students: {},
    admins: {
      'admin@college.edu': {
        collegeId: 'ADM-COLLEGE-001',
        name: 'Head Administrator',
        email: 'admin@college.edu',
        passwordHash: hashPassword('Admin@12345', defaultAdminSalt),
        salt: defaultAdminSalt,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      },
    },
    sessions: {},
  };

  saveStore(freshStore);
  return freshStore;
}

// Atomic File Storage to prevent race conditions or database corruption
function saveStore(store) {
  try {
    const payload = JSON.stringify(store, null, 2);
    fs.writeFileSync(STORE_TMP_FILE, payload, { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(STORE_TMP_FILE, STORE_FILE);
  } catch (err) {
    console.error('[AUTH STORE] Failed atomic store write:', err);
  }
}

// Validate session token helper
export function validateSessionToken(token) {
  if (!token) return null;
  const store = loadStore();
  const session = store.sessions[token];
  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      delete store.sessions[token];
      saveStore(store);
    }
    return null;
  }
  return session;
}

// In-memory OTP Store: email -> { otpHash, expiresAt, attempts, role, collegeId }
const otpStore = new Map();

// Rate Limiters
const otpRateLimit = new Map(); // ip_email -> { count, resetAt }
const loginAttemptLimit = new Map(); // ip_identifier -> { failedAttempts, lockedUntil }

// Input Sanitization helper (XSS / Injection prevention)
function sanitizeInput(val, maxLength = 120) {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .replace(/[<>'"`;()]/g, '') // strip dangerous script & SQL control chars
    .slice(0, maxLength);
}

function sanitizeEmail(val) {
  if (typeof val !== 'string') return '';
  const clean = val.trim().toLowerCase().slice(0, 100);
  // Strict RFC 5322 regex validation
  const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    clean
  );
  return isValid ? clean : null;
}

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function handleAuthRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  // Read Request Body with Strict 64KB DoS Size Guard
  let rawBody = '';
  if (req.method === 'POST') {
    let size = 0;
    const MAX_SIZE = 64 * 1024; // 64KB max payload for auth

    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_SIZE) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload Too Large' }));
        return;
      }
      rawBody += chunk;
    }
  }

  let body = {};
  if (rawBody) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
      return;
    }
  }

  // ROUTE 1: POST /api/auth/send-otp
  if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
    const rawEmail = body.email || '';
    const email = sanitizeEmail(rawEmail);
    const role = body.role === 'admin' ? 'admin' : 'user';
    const collegeId = sanitizeInput(body.collegeId || '', 40).toUpperCase();

    if (!email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please enter a valid college email address.' }));
      return;
    }

    if (!collegeId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'College ID is required.' }));
      return;
    }

    // Rate Limiting: max 4 requests per 5 minutes per email/IP
    const rateKey = `${ip}_${email}`;
    const now = Date.now();
    const limitRecord = otpRateLimit.get(rateKey) || { count: 0, resetAt: now + 5 * 60 * 1000 };
    if (now > limitRecord.resetAt) {
      limitRecord.count = 0;
      limitRecord.resetAt = now + 5 * 60 * 1000;
    }
    if (limitRecord.count >= 4) {
      const waitSec = Math.ceil((limitRecord.resetAt - now) / 1000);
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Too many OTP requests. Please wait ${waitSec} seconds.` }));
      return;
    }
    limitRecord.count += 1;
    otpRateLimit.set(rateKey, limitRecord);

    // Generate 6-digit cryptographic OTP
    const rawOtp = generateOtp();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(email, {
      otpHash,
      expiresAt,
      attempts: 0,
      role,
      collegeId,
    });

    // Dispatch OTP via email service (SMTP / Gmail, or terminal fallback)
    const emailResult = await sendOtpEmail(email, rawOtp, role);

    // DEBUG MODE: Only expose devOtp if DEBUG_AUTH is explicitly true AND not in production!
    const isDebugAllowed = process.env.DEBUG_AUTH === 'true' && process.env.NODE_ENV !== 'production';

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: emailResult.sent
          ? `Verification OTP sent to ${email}. Please check your inbox.`
          : `OTP dispatched for ${email}.${emailResult.fallback ? ' (Displayed in server terminal - configure SMTP in .env for direct email delivery)' : ''}`,
        expiresIn: 300,
        emailSent: emailResult.sent,
        ...(isDebugAllowed ? { devOtp: rawOtp } : {}),
      })
    );
    return;
  }

  // ROUTE 2: POST /api/auth/verify-otp
  if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
    const email = sanitizeEmail(body.email || '');
    const otp = sanitizeInput(body.otp || '', 6);

    if (!email || !otp) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email and 6-digit OTP are required.' }));
      return;
    }

    const record = otpStore.get(email);
    if (!record) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No active OTP found. Please request a new OTP.' }));
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'OTP has expired. Please request a new one.' }));
      return;
    }

    if (record.attempts >= 4) {
      otpStore.delete(email);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Maximum verification attempts exceeded. Please request a new OTP.' }));
      return;
    }

    const inputHash = hashOtp(otp);
    if (!crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(record.otpHash))) {
      record.attempts += 1;
      const remaining = 4 - record.attempts;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Incorrect OTP. ${remaining} attempt(s) remaining.` }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Email OTP verified successfully.' }));
    return;
  }

  // ROUTE 3: POST /api/auth/student-login (Student Registration / Sign-In with OTP)
  if (pathname === '/api/auth/student-login' && req.method === 'POST') {
    const collegeId = sanitizeInput(body.collegeId || '', 40).toUpperCase();
    const name = sanitizeInput(body.name || '', 60);
    const rollNumber = sanitizeInput(body.rollNumber || '', 40).toUpperCase();
    const branch = sanitizeInput(body.branch || '', 60);
    const section = sanitizeInput(body.section || '', 30);
    const email = sanitizeEmail(body.email || '');
    const password = body.password || '';
    const otp = sanitizeInput(body.otp || '', 6);

    // Validation
    if (!collegeId || !name || !rollNumber || !branch || !section || !email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'All fields (Student Name, College ID, Roll Number, Branch, Section, Email) are required.',
        })
      );
      return;
    }

    // Verify OTP
    const record = otpStore.get(email);
    if (!record) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please request and enter your email OTP to verify your identity.' }));
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'OTP has expired. Please request a new one.' }));
      return;
    }

    const inputHash = hashOtp(otp);
    if (!crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(record.otpHash))) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid OTP code. Please check your email or resend.' }));
      return;
    }

    // Consume OTP immediately to prevent replay attacks
    otpStore.delete(email);

    const store = loadStore();

    // Password security: Hash password with PBKDF2 if provided
    let salt = generateSalt();
    let passwordHash = password ? hashPassword(password, salt) : null;

    const studentUser = {
      role: 'user',
      collegeId,
      name,
      rollNumber,
      branch,
      section,
      email,
      isEmailVerified: true,
      updatedAt: new Date().toISOString(),
    };

    store.students[collegeId] = {
      ...(store.students[collegeId] || {}),
      ...studentUser,
      passwordHash: passwordHash || store.students[collegeId]?.passwordHash,
      salt: password ? salt : store.students[collegeId]?.salt,
      createdAt: store.students[collegeId]?.createdAt || new Date().toISOString(),
    };

    // 1. Save student record to MongoDB Atlas
    await saveStudentToDb(store.students[collegeId]);

    // Create cryptographically random 256-bit session token
    const token = crypto.randomBytes(32).toString('hex');
    const sessionRecord = {
      user: studentUser,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days TTL
    };
    store.sessions[token] = sessionRecord;

    // 2. Save session and audit log to MongoDB Atlas
    await saveSessionToDb(token, sessionRecord);
    await logAuthEventToDb('student_signup_otp', { collegeId, email, name });

    saveStore(store);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: `Welcome ${name}! Student account verified and signed in successfully.`,
        token,
        user: studentUser,
      })
    );
    return;
  }

  // ROUTE 3B: POST /api/auth/student-password-login (Direct Student Login with Password)
  if (pathname === '/api/auth/student-password-login' && req.method === 'POST') {
    const identifier = sanitizeInput(body.identifier || '', 100);
    const password = body.password || '';

    if (!identifier || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please enter your College ID or Email and Password.' }));
      return;
    }

    const store = loadStore();
    const cleanId = identifier.toUpperCase();
    const cleanEmail = identifier.toLowerCase();

    // Find student in MongoDB Atlas first, then fallback to local store
    let student = null;
    if (isMongoConnected()) {
      student = await findStudentByIdentifierFromDb(identifier);
    }
    if (!student) {
      student =
        store.students[cleanId] ||
        Object.values(store.students).find(
          (s) => s.email?.toLowerCase() === cleanEmail || s.collegeId?.toUpperCase() === cleanId
        );
    }

    if (!student || !student.passwordHash || !student.salt) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'No registered student account found. Please sign in with OTP first to set up your password.',
        })
      );
      return;
    }

    const computedHash = hashPassword(password, student.salt);
    if (!crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(student.passwordHash))) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Incorrect password. Please try again.' }));
      return;
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const userPayload = {
      role: 'user',
      collegeId: student.collegeId,
      name: student.name || student.rollNumber,
      rollNumber: student.rollNumber,
      branch: student.branch,
      section: student.section,
      email: student.email,
      isEmailVerified: true,
      updatedAt: student.updatedAt || new Date().toISOString(),
    };

    const sessionRecord = {
      user: userPayload,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    store.sessions[token] = sessionRecord;

    // Save session and audit log to MongoDB Atlas
    await saveSessionToDb(token, sessionRecord);
    await logAuthEventToDb('student_login_password', { collegeId: student.collegeId, email: student.email });

    saveStore(store);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: `Welcome back, ${userPayload.name}!`,
        token,
        user: userPayload,
      })
    );
    return;
  }

  // ROUTE 4: POST /api/auth/admin-login
  if (pathname === '/api/auth/admin-login' && req.method === 'POST') {
    const collegeId = sanitizeInput(body.collegeId || '', 40).toUpperCase();
    const name = sanitizeInput(body.name || '', 60);
    const password = body.password || '';
    const email = sanitizeEmail(body.email || '');
    const otp = sanitizeInput(body.otp || '', 6);

    // Brute-force lockout protection
    const lockoutKey = `${ip}_${collegeId}`;
    const now = Date.now();
    const lockout = loginAttemptLimit.get(lockoutKey) || { failedAttempts: 0, lockedUntil: 0 };

    if (now < lockout.lockedUntil) {
      const waitMinutes = Math.ceil((lockout.lockedUntil - now) / 60000);
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Account temporarily locked due to excessive failed attempts. Try again in ${waitMinutes} minutes.` }));
      return;
    }

    if (!collegeId || !name || !password || !email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'College ID, Admin Name, Password, and Email are required.' }));
      return;
    }

    if (password.length < 6) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Admin password must be at least 6 characters long.' }));
      return;
    }

    // Verify OTP
    const record = otpStore.get(email);
    if (!record) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please request and enter your admin email OTP.' }));
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'OTP has expired. Please request a new one.' }));
      return;
    }

    const inputHash = hashOtp(otp);
    if (!crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(record.otpHash))) {
      lockout.failedAttempts += 1;
      if (lockout.failedAttempts >= 5) {
        lockout.lockedUntil = now + 15 * 60 * 1000; // 15 mins lock
      }
      loginAttemptLimit.set(lockoutKey, lockout);

      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid OTP code. Please check your email or resend.' }));
      return;
    }

    // Consume OTP
    otpStore.delete(email);

    const store = loadStore();
    const existingAdmin = store.admins[email] || Object.values(store.admins).find((a) => a.collegeId === collegeId);

    if (existingAdmin) {
      const computedHash = hashPassword(password, existingAdmin.salt);
      if (!crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(existingAdmin.passwordHash))) {
        lockout.failedAttempts += 1;
        if (lockout.failedAttempts >= 5) {
          lockout.lockedUntil = now + 15 * 60 * 1000;
        }
        loginAttemptLimit.set(lockoutKey, lockout);

        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid admin credentials or password.' }));
        return;
      }
    } else {
      // First-time registration of this College Admin: Generate fresh unique salt & 210,000 PBKDF2 hash
      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      store.admins[email] = {
        collegeId,
        name,
        email,
        passwordHash,
        salt,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
    }

    // Reset failed attempts counter on success
    loginAttemptLimit.delete(lockoutKey);

    // Save admin to MongoDB Atlas
    await saveAdminToDb(store.admins[email]);

    const adminUser = {
      role: 'admin',
      collegeId,
      name,
      email,
      isEmailVerified: true,
    };

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const sessionRecord = {
      user: adminUser,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    store.sessions[token] = sessionRecord;

    // Save admin session & audit log to MongoDB Atlas
    await saveSessionToDb(token, sessionRecord);
    await logAuthEventToDb('admin_login', { collegeId, email, name });

    saveStore(store);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: `Welcome Admin ${name}! Authentication successful.`,
        token,
        user: adminUser,
      })
    );
    return;
  }

  // ROUTE 4B: POST /api/auth/admin-password-login (Direct Admin Login with Password)
  if (pathname === '/api/auth/admin-password-login' && req.method === 'POST') {
    const identifier = sanitizeInput(body.identifier || body.collegeId || body.email || '', 100);
    const password = body.password || '';

    // Brute-force lockout protection
    const cleanKey = identifier.toLowerCase();
    const lockoutKey = `${ip}_admin_${cleanKey}`;
    const now = Date.now();
    const lockout = loginAttemptLimit.get(lockoutKey) || { failedAttempts: 0, lockedUntil: 0 };

    if (now < lockout.lockedUntil) {
      const waitMinutes = Math.ceil((lockout.lockedUntil - now) / 60000);
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Account temporarily locked due to excessive failed attempts. Try again in ${waitMinutes} minutes.` }));
      return;
    }

    if (!identifier || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please enter your College Admin ID or Admin Email, and Password.' }));
      return;
    }

    const store = loadStore();
    const cleanId = identifier.toUpperCase();
    const cleanEmail = identifier.toLowerCase();

    // Check MongoDB Atlas first if connected, then fallback to local store
    let admin = null;
    if (isMongoConnected()) {
      admin = await getAdminFromDb(identifier);
    }
    if (!admin) {
      admin =
        store.admins[cleanEmail] ||
        Object.values(store.admins).find(
          (a) => a.collegeId?.toUpperCase() === cleanId || a.email?.toLowerCase() === cleanEmail
        );
    }

    if (!admin || !admin.passwordHash || !admin.salt) {
      lockout.failedAttempts += 1;
      if (lockout.failedAttempts >= 5) {
        lockout.lockedUntil = now + 15 * 60 * 1000;
      }
      loginAttemptLimit.set(lockoutKey, lockout);

      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No admin account found with these credentials. Please check your ID/Email.' }));
      return;
    }

    const computedHash = hashPassword(password, admin.salt);
    if (!crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(admin.passwordHash))) {
      lockout.failedAttempts += 1;
      if (lockout.failedAttempts >= 5) {
        lockout.lockedUntil = now + 15 * 60 * 1000;
      }
      loginAttemptLimit.set(lockoutKey, lockout);

      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Incorrect admin password. Please try again.' }));
      return;
    }

    // Reset lockout on success
    loginAttemptLimit.delete(lockoutKey);

    const adminUser = {
      role: 'admin',
      collegeId: admin.collegeId,
      name: admin.name || 'Head Administrator',
      email: admin.email,
      isEmailVerified: true,
    };

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const sessionRecord = {
      user: adminUser,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    store.sessions[token] = sessionRecord;

    await saveSessionToDb(token, sessionRecord);
    await logAuthEventToDb('admin_login_password', { collegeId: adminUser.collegeId, email: adminUser.email });

    saveStore(store);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: `Welcome back, Admin ${adminUser.name}! Authentication successful.`,
        token,
        user: adminUser,
      })
    );
    return;
  }

  // ROUTE 5: GET /api/auth/me
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: No session token provided.' }));
      return;
    }

    const store = loadStore();
    const session = store.sessions[token];

    if (!session || Date.now() > session.expiresAt) {
      if (session) {
        delete store.sessions[token];
        saveStore(store);
      }
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Session expired. Please log in again.' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, user: session.user }));
    return;
  }

  // ROUTE 6: POST /api/auth/logout
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (token) {
      const store = loadStore();
      if (store.sessions[token]) {
        delete store.sessions[token];
        saveStore(store);
      }
      // Remove session from MongoDB Atlas
      await deleteSessionFromDb(token);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
    return;
  }

  // ROUTE 7: GET /api/auth/admin/students (Strict Role-Based Access Control)
  if (pathname === '/api/auth/admin/students' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    const store = loadStore();
    const session = store.sessions[token];

    if (!session || session.user.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden: Admin authorization required.' }));
      return;
    }

    // Fetch live students from MongoDB Atlas if connected, or fallback to store
    const studentsList = isMongoConnected() ? await getAllStudentsFromDb() : Object.values(store.students);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, students: studentsList, total: studentsList.length }));
    return;
  }

  // 404 for unhandled auth routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Authentication endpoint not found.' }));
}
