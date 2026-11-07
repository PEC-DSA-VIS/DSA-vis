# API & Integration Contract

All frontend requests are relative (`/api/...`) and proxied by Vite to `http://localhost:3001` in development. In production the Node server serves the built frontend and handles the same paths.

> No keys, passwords, tokens, connection strings or `.env` values are included in this package.

---

## 1. Authentication

Session model: opaque 256-bit bearer token.

- Client stores `algoviz_auth_token` and `algoviz_auth_user` in `localStorage`.
- Every authenticated request sends `Authorization: Bearer <token>`.
- On boot, `AuthContext` calls `GET /api/auth/me` to validate and refresh the user.
- `401` clears the local session; network failure keeps the cached session.

### Endpoints

| Method | Path | Body | Response | Frontend caller |
|---|---|---|---|---|
| POST | `/api/auth/send-otp` | `{ email, role: 'user'\|'admin', collegeId }` | `{ message, devOtp? }` | `AuthContext.sendOtp` |
| POST | `/api/auth/verify-otp` | OTP payload | verification result | Not called by current UI |
| POST | `/api/auth/student-login` | `{ name, collegeId, rollNumber, branch, section, email, password?, otp }` | `{ token, user, message }` | `AuthContext.loginStudent` |
| POST | `/api/auth/student-password-login` | `{ identifier, password }` | `{ token, user, message }` | `AuthContext.loginStudentWithPassword` |
| POST | `/api/auth/admin-login` | `{ collegeId, name, password?, email, otp }` | `{ token, user, message }` | `AuthContext.loginAdmin` |
| POST | `/api/auth/admin-password-login` | `{ identifier, password }` | `{ token, user, message }` | `AuthContext.loginAdminWithPassword` |
| GET | `/api/auth/me` | — (Bearer) | `{ user }` | `AuthContext` session restore |
| POST | `/api/auth/logout` | — (Bearer) | `{ message }` | `AuthContext.logout` |
| GET | `/api/auth/admin/students` | — (Bearer, admin) | student list | `AdminDashboardModal` |

`user.role` is `'user'` or `'admin'`. UI gating keys off `isAuthenticated` and `isAdmin`.

## 2. Contests

| Method | Path | Body / Auth | Purpose | Caller |
|---|---|---|---|---|
| GET | `/api/contests` | — | List contests | `ContestPage.fetchContests` |
| GET | `/api/contests/:id` | — | Contest detail + questions | Contest service |
| GET | `/api/contests/:id/leaderboard` | — | Ranked submissions | `ContestPage` |
| POST | `/api/contests/submit` | Bearer; `{ contestId, questionId, code, language, passCount, totalTests }` | Submit and score | `ContestPage.handleSubmitSolution` |

Admin contest management is exposed through `AdminDashboardModal`:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/admin/contests` | Create contest |
| POST | `/api/admin/questions` | Add question to bank |
| GET | `/api/admin/questions` | List question bank |
| GET | `/api/admin/analytics` | Branch / participation analytics |

## 3. AI Chat & Problem Solver

```
POST /api/chat
Content-Type: application/json
```

- Returns **Server-Sent Events / streamed chunks**.
- Per-IP limit: 25 requests/minute.
- Used by `src/components/chat/ChatDrawer.tsx` and `src/pages/ProblemSolverPage.tsx`.
- The stream includes mentoring text plus JSON tool actions that drive playback (`jumpToStep`, `stepForward`, etc.).
- If the AI key is not configured, the backend falls back to built-in DSA heuristics.

**Do not change** the streaming reader logic or tool-action parsing during a visual redesign.

## 4. Data contracts the UI must preserve

From `src/types/index.ts`:

```ts
interface StepAction<TData = any> {
  type: StepType;
  indices?: number[];
  pointers?: Record<string, number | string | null>;
  discardedIndices?: number[];
  gridCell?: [number, number] | null;
  visitedCells?: [number, number][];
  bitIndex?: number | null;
  bitOperation?: string;
  callStack?: { name: string; args: string; returnValue?: string | number }[];
  dataState: TData;
  codeLine: number;
  message: string;
  reason: StepReason;
  comparisonsCount?: number;
  swapsCount?: number;
  customMetadata?: Record<string, any>;
}
```

`AlgorithmDefinition` supplies `id`, `name`, `category`, `categoryName`, `part`, `difficulty`, `description`, `realLifeExample`, `complexity`, `pseudocode`, `explanation`, `tags`, `boardType`, `defaultInput`, `presets`, `generateRandomInput`, `validateInput`, `run` (generator), and optional `quiz`.

Store fields consumed by UI: `currentAlgorithm`, `currentAlgorithmId`, `input`, `inputError`, `steps`, `currentStepIndex`, `isPlaying`, `speed`, `isCompleted`, `comparisons`, `swaps`, `chartData`, `soundMuted`, `autoPauseImportant`, `whyDisplayMode`, `reduceMotion`, `compareAlgorithmId` plus the documented actions.

## 5. Persistence keys

| Key / param | Purpose |
|---|---|
| `algoviz_theme` | `'light' \| 'dark'` |
| `algoviz_last_state` | `{ algoId, input }` |
| `algoviz_sound_muted` | boolean |
| `algoviz_auth_token` | session token |
| `algoviz_auth_user` | cached user JSON |
| `?view=` | active view (`home`, `topics`, `visualizer`, `compare`, `solver`, `contests`) |
| `?algo=` | active algorithm id |
| `?input=` | URL-encoded JSON input |

## 6. Backend facts (for context only)

- Runtime: native Node `http` server, ES modules, port `3001` by default.
- Database: MongoDB Atlas (`students`, `admins`, `sessions`, `auth_logs`, `contests`, `submissions`, `questions`) with JSON file fallback under `backend/data/`.
- Passwords: PBKDF2-SHA512 (210k iterations, per-user salt).
- OTP: SHA-256 hashed, expiring, attempt-limited, in-memory.
- Security headers, CORS allowlist and path-traversal protection are applied globally.
- The server serves `frontend/dist` and falls back to `index.html` for SPA routes.

The backend is **not** part of this handoff and must not be modified by the redesign.
