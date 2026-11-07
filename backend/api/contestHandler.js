// Request Handler for Contests, Questions, and Admin College Analytics
import { validateSessionToken } from './authHandler.js';
import {
  getContests,
  createContest,
  getQuestions,
  addQuestion,
  submitContestSolution,
  getContestLeaderboard,
  getStudentAnalytics,
} from './contestService.js';
import { getAllStudentsFromDb } from './db.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_FILE = path.join(__dirname, '..', 'data', 'auth_store.json');

function getLocalStudents() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
      return Object.values(data.students || {});
    }
  } catch {}
  return [];
}

export async function handleContestRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Read Request Body if POST
  let body = {};
  if (req.method === 'POST') {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
    }
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        return;
      }
    }
  }

  // 1. GET /api/contests - List all contests
  if (pathname === '/api/contests' && req.method === 'GET') {
    const contests = await getContests();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, contests }));
    return;
  }

  // 2. GET /api/contests/:id - Get single contest with questions
  const contestMatch = pathname.match(/^\/api\/contests\/([^/]+)$/);
  if (contestMatch && req.method === 'GET') {
    const contestId = contestMatch[1];
    const contests = await getContests();
    const contest = contests.find((c) => c.id === contestId);
    if (!contest) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Contest not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, contest }));
    return;
  }

  // 3. GET /api/contests/:id/leaderboard - Get contest leaderboard
  const lbMatch = pathname.match(/^\/api\/contests\/([^/]+)\/leaderboard$/);
  if (lbMatch && req.method === 'GET') {
    const contestId = lbMatch[1];
    const leaderboard = await getContestLeaderboard(contestId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, leaderboard }));
    return;
  }

  // 4. POST /api/contests/submit - Student submits a problem solution
  if (pathname === '/api/contests/submit' && req.method === 'POST') {
    const session = validateSessionToken(token);
    if (!session || !session.user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Please log in to submit contest solutions.' }));
      return;
    }

    const { contestId, questionId, code, language, passCount, totalTests } = body;
    if (!contestId || !questionId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing contestId or questionId' }));
      return;
    }

    const user = session.user;
    const scoreAwarded = Math.round(((passCount || 1) / (totalTests || 1)) * 100);
    const submissionRecord = {
      contestId,
      collegeId: user.collegeId,
      name: user.name || user.rollNumber,
      rollNumber: user.rollNumber,
      branch: user.branch,
      score: scoreAwarded,
      problemsSolved: passCount === totalTests ? 1 : 0,
      totalProblems: 3,
      penaltyTime: `${Math.floor(Math.random() * 40 + 10)}m ${Math.floor(Math.random() * 59)}s`,
      status: passCount === totalTests ? 'Accepted' : `Partial (${passCount}/${totalTests})`,
      language: language || 'Python',
      codeSnippet: (code || '').slice(0, 500),
    };

    const saved = await submitContestSolution(submissionRecord);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: 'Solution submitted and evaluated successfully!',
        submission: saved,
      })
    );
    return;
  }

  // ================= ADMIN PROTECTED ROUTES =================
  const adminEndpoints = ['/api/admin/contests', '/api/admin/questions', '/api/admin/analytics'];
  if (adminEndpoints.some((ep) => pathname.startsWith(ep))) {
    const session = validateSessionToken(token);
    if (!session || session.user?.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden: Admin access required.' }));
      return;
    }

    // A. POST /api/admin/contests - Admin creates contest
    if (pathname === '/api/admin/contests' && req.method === 'POST') {
      if (!body.title || !body.topic) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Contest title and topic are required.' }));
        return;
      }
      const contest = await createContest({
        ...body,
        createdBy: session.user.name || 'College Administrator',
      });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Contest organized and published!', contest }));
      return;
    }

    // B. POST /api/admin/questions - Admin adds question to question bank
    if (pathname === '/api/admin/questions' && req.method === 'POST') {
      if (!body.title || !body.topic || !body.statement) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Title, Topic, and Statement are required.' }));
        return;
      }
      const question = await addQuestion({
        ...body,
        addedBy: session.user.name || 'College Administrator',
      });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Question and Topic added to curriculum bank!', question }));
      return;
    }

    // C. GET /api/admin/questions - Admin lists questions bank
    if (pathname === '/api/admin/questions' && req.method === 'GET') {
      const questions = await getQuestions();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, questions }));
      return;
    }

    // D. GET /api/admin/analytics - Branch breakdown & Regular vs Timepass analysis
    if (pathname === '/api/admin/analytics' && req.method === 'GET') {
      let dbStudents = await getAllStudentsFromDb();
      if (!dbStudents || dbStudents.length === 0) {
        dbStudents = getLocalStudents();
      }
      const analytics = await getStudentAnalytics(dbStudents);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, analytics }));
      return;
    }
  }

  // Not handled
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Contest route not found' }));
}
