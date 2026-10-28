// MongoDB Atlas Database Adapter for AlgoViz
// Manages persistent collections for students, admins, sessions, and audit telemetry.
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureEnvLoaded() {
  if (process.env.MONGODB_URI) return;
  const candidateEnvFiles = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', 'main.env'),
    path.join(__dirname, '..', '..', '.env'),
    path.join(__dirname, '..', '..', 'main.env'),
  ];
  for (const envPath of candidateEnvFiles) {
    try {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [k, ...v] = trimmed.split('=');
            if (k && v && !process.env[k.trim()]) {
              process.env[k.trim()] = v.join('=').trim().replace(/(^"|"$)/g, '');
            }
          }
        });
      }
    } catch {}
  }
}

let client = null;
let db = null;
let isConnected = false;

/**
 * Initializes and connects to MongoDB Atlas cluster
 */
export async function initMongo() {
  ensureEnvLoaded();
  const DB_NAME = process.env.MONGODB_DB_NAME || 'algoviz';
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[MONGODB] ⚠️ No MONGODB_URI found in environment. Using local file persistence.');
    return null;
  }

  // Ensure retryWrites and w=majority params
  let connectionUri = uri;
  if (!connectionUri.includes('retryWrites=')) {
    connectionUri += (connectionUri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
  }

  try {
    if (!client) {
      client = new MongoClient(connectionUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 6000,
        connectTimeoutMS: 8000,
      });
    }

    await client.connect();
    db = client.db(DB_NAME);
    isConnected = true;
    console.log(`[MONGODB] 🟢 Connected to MongoDB Atlas Database: "${DB_NAME}"`);

    // Ensure indexes for fast, unique lookups
    try {
      await db.collection('students').createIndex({ collegeId: 1 }, { unique: true });
      await db.collection('students').createIndex({ email: 1 });
      await db.collection('admins').createIndex({ email: 1 }, { unique: true });
      await db.collection('admins').createIndex({ collegeId: 1 });
      await db.collection('sessions').createIndex({ token: 1 }, { unique: true });
      await db.collection('sessions').createIndex({ expiresAt: 1 });
      console.log('[MONGODB] ⚡ Database indexes verified for students, admins, and sessions.');
    } catch (idxErr) {
      // Non-fatal if index exists
    }

    return db;
  } catch (err) {
    isConnected = false;
    console.error('[MONGODB] ❌ Atlas connection error:', err.message);
    console.log('[MONGODB] ℹ️ Seamlessly falling back to atomic file storage.');
    return null;
  }
}

export function isMongoConnected() {
  return isConnected && db !== null;
}

export function getDb() {
  return db;
}

// ================= STUDENTS =================
export async function getStudentFromDb(collegeId) {
  if (!isMongoConnected()) return null;
  try {
    return await db.collection('students').findOne({ collegeId: collegeId.toUpperCase() });
  } catch (e) {
    console.error('[MONGODB] Error fetching student:', e.message);
    return null;
  }
}

export async function findStudentByIdentifierFromDb(identifier) {
  if (!isMongoConnected()) return null;
  try {
    const clean = identifier.trim();
    return await db.collection('students').findOne({
      $or: [
        { collegeId: clean.toUpperCase() },
        { email: clean.toLowerCase() },
        { rollNumber: clean.toUpperCase() },
      ],
    });
  } catch (e) {
    console.error('[MONGODB] Error searching student:', e.message);
    return null;
  }
}

export async function saveStudentToDb(studentData) {
  if (!isMongoConnected()) return false;
  try {
    const collegeId = studentData.collegeId.toUpperCase();
    await db.collection('students').updateOne(
      { collegeId },
      {
        $set: {
          ...studentData,
          collegeId,
          email: studentData.email.toLowerCase(),
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: studentData.createdAt || new Date().toISOString(),
        },
      },
      { upsert: true }
    );
    console.log(`[MONGODB] 💾 Student record saved to Atlas: ${collegeId} (${studentData.name || studentData.rollNumber})`);
    return true;
  } catch (e) {
    console.error('[MONGODB] Error saving student:', e.message);
    return false;
  }
}

export async function getAllStudentsFromDb() {
  if (!isMongoConnected()) return [];
  try {
    return await db.collection('students').find({}, { projection: { passwordHash: 0, salt: 0 } }).toArray();
  } catch (e) {
    console.error('[MONGODB] Error listing students:', e.message);
    return [];
  }
}

// ================= ADMINS =================
export async function getAdminFromDb(emailOrCollegeId) {
  if (!isMongoConnected()) return null;
  try {
    const clean = emailOrCollegeId.trim();
    return await db.collection('admins').findOne({
      $or: [
        { email: clean.toLowerCase() },
        { collegeId: clean.toUpperCase() },
      ],
    });
  } catch (e) {
    console.error('[MONGODB] Error fetching admin:', e.message);
    return null;
  }
}

export async function saveAdminToDb(adminData) {
  if (!isMongoConnected()) return false;
  try {
    const email = adminData.email.toLowerCase();
    await db.collection('admins').updateOne(
      { email },
      {
        $set: {
          ...adminData,
          email,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: adminData.createdAt || new Date().toISOString(),
        },
      },
      { upsert: true }
    );
    console.log(`[MONGODB] 💾 Admin record saved to Atlas: ${adminData.collegeId} (${adminData.name})`);
    return true;
  } catch (e) {
    console.error('[MONGODB] Error saving admin:', e.message);
    return false;
  }
}

export async function getAllAdminsFromDb() {
  if (!isMongoConnected()) return [];
  try {
    return await db.collection('admins').find({}, { projection: { passwordHash: 0, salt: 0 } }).toArray();
  } catch (e) {
    console.error('[MONGODB] Error listing admins:', e.message);
    return [];
  }
}

// ================= SESSIONS =================
export async function saveSessionToDb(token, sessionData) {
  if (!isMongoConnected()) return false;
  try {
    await db.collection('sessions').updateOne(
      { token },
      {
        $set: {
          token,
          user: sessionData.user,
          createdAt: sessionData.createdAt || new Date().toISOString(),
          expiresAt: sessionData.expiresAt,
        },
      },
      { upsert: true }
    );
    return true;
  } catch (e) {
    console.error('[MONGODB] Error saving session:', e.message);
    return false;
  }
}

export async function getSessionFromDb(token) {
  if (!isMongoConnected()) return null;
  try {
    return await db.collection('sessions').findOne({ token });
  } catch (e) {
    console.error('[MONGODB] Error fetching session:', e.message);
    return null;
  }
}

export async function deleteSessionFromDb(token) {
  if (!isMongoConnected()) return false;
  try {
    await db.collection('sessions').deleteOne({ token });
    return true;
  } catch (e) {
    console.error('[MONGODB] Error deleting session:', e.message);
    return false;
  }
}

// ================= AUDIT LOGS =================
export async function logAuthEventToDb(eventType, details) {
  if (!isMongoConnected()) return false;
  try {
    await db.collection('auth_logs').insertOne({
      eventType,
      details,
      timestamp: new Date().toISOString(),
    });
    return true;
  } catch {
    return false;
  }
}
