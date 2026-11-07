# AlgoViz Project Audit

**Audit date:** 07 November 2026  
**Prepared for:** Aurora Learning redesign handoff  
**Audit type:** Read-only inspection — no files in the existing project were modified, deleted, or renamed.

---

## 0. Source of Truth

Two copies of AlgoViz exist in this workspace:

| Folder | Status | Notes |
|---|---|---|
| `DSA-vis/` | Git-tracked, last modified 28 Oct 2026 | Previous working copy; 5 views, no contest module |
| `AlgoviZ_CLONE_FRESH/` | Untracked, last modified 07 Nov 2026 | **Newest copy, used for this audit and the handoff package**; adds `ContestPage` and contest/admin APIs |

`AlgoviZ_CLONE_FRESH` is the canonical source for the redesign. The handoff package is built from:

```
AlgoviZ_CLONE_FRESH/frontend/
```

`AlgoviZ_CLONE_FRESH/stitch_algoviz_learning_observatory/` contains a static "AlgoViz Observatory" design mockup (55 KB single HTML file) and is included in the handoff as a visual reference only.

---

## 1. Tech Stack

### Frontend
| Concern | Technology | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.7.2 |
| Build tool | Vite | 6.1.0 |
| React plugin | `@vitejs/plugin-react` | 4.3.4 |
| Styling | Tailwind CSS | 4.0.0 (CSS-first, `@theme` in `src/index.css`; **no `tailwind.config.js`**) |
| Tailwind integration | `@tailwindcss/vite` | 4.0.0 |
| Component primitives | Radix UI (`dialog`, `dropdown-menu`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `slider`, `slot`, `tabs`, `tooltip`) | 1.x / 2.x |
| Variant styling | `class-variance-authority` | 0.7.1 |
| Class utilities | `clsx`, `tailwind-merge` | 2.1.1 / 3.0.1 |
| State management | Zustand | 5.0.3 |
| Animation | `framer-motion` | 12.4.7 |
| Animation (custom) | Canvas (`StarfieldCanvas`), CSS keyframes, Aceternity/MagicUI components | — |
| Icons | `lucide-react` | 0.475.0 |
| Charts | `recharts` | 2.15.1 |
| Confetti | `canvas-confetti` | 1.9.4 |
| Installed but unused | `@xyflow/react`, `zod` | 12.3.6 / 4.6.7 |

### Backend
- **Runtime:** Node.js with the native `node:http` module (no Express/Fastify).
- **Module system:** ES modules (`"type": "module"`).
- **Handlers:** `backend/api/authHandler.js`, `chatHandler.js`, `contestHandler.js`, `contestService.js`, `db.js`, `emailService.js`.
- **Dependencies:** `mongodb ^7.7.0`, `nodemailer ^10.2.1`.
- **Static serving:** the backend serves `frontend/dist` when built, with SPA fallback.

### Database
- **Primary:** MongoDB Atlas (`MONGODB_URI`, database `algoviz`).
- **Collections:** `students`, `admins`, `sessions`, `auth_logs`, plus `contests` through the contest service.
- **Fallback:** atomic JSON file persistence (`backend/data/auth_store.json`, `contests_store.json`) when MongoDB is unavailable.
- **OTP storage:** in-memory map (hashed OTP, expiry, attempt counter).

### Routing
- **No React Router / no URL-path routing.**
- A single `currentView` state in `App.tsx` (`NavView = 'home' | 'topics' | 'visualizer' | 'compare' | 'solver' | 'contests'`).
- Deep-link support via query parameters: `?view=`, `?algo=`, `?input=`.
- `window.history.replaceState` is used instead of navigation.
- Global command palette on `Ctrl/Cmd + K`.

### Animation Libraries
- `framer-motion` (Aceternity/MagicUI wrappers and page reveal effects).
- Canvas 2D particles (`StarfieldCanvas`).
- Tailwind `animate-in`, `fade-in`, `slide-in-from-bottom`, `pulse`.
- `canvas-confetti` for completion celebrations.
- Web Audio API synthesizer (`src/lib/audio.ts`).
- `prefers-reduced-motion` global override already present in `index.css`.

---

## 2. Project Structure (Frontend)

```
AlgoviZ_CLONE_FRESH/frontend/
├── index.html                     # HTML shell, Google Fonts, favicon
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts                 # React + Tailwind v4 plugins, @ alias, /api proxy -> :3001
├── public/
│   └── logo.svg                   # Only public asset (favicon)
├── scripts/
│   ├── testChecklist.ts
│   └── testReasonValidation.js
└── src/
    ├── main.tsx                   # React root; runs reason-validation suite at boot
    ├── App.tsx                    # App shell, view state, theme, auth gating, global modals
    ├── index.css                  # Tailwind v4 import, all design tokens, glass/aurora utilities
    ├── algorithms/                # Pure algorithm engines (generator functions)
    │   ├── registry.ts            # 20 categories, 58 registered algorithms, catalog search
    │   ├── dsaModules.ts          # Aggregated Part 1/2 curriculum metadata
    │   ├── dsaModulesOriginal.ts
    │   ├── sorting/, searching/   # Hand-written classic algorithms
    │   ├── arrayPatternGenerators.ts
    │   ├── backtrackingGenerators.ts
    │   ├── bitGenerators.ts
    │   ├── divideAndConquerGenerators.ts
    │   ├── dpGenerators.ts
    │   ├── graphGenerators.ts
    │   ├── greedyGenerators.ts
    │   ├── hashGenerators.ts
    │   ├── heapGenerators.ts
    │   ├── linkedListGenerators.ts
    │   ├── matrixGenerators.ts
    │   ├── recursionGenerators.ts
    │   ├── stackQueueGenerators.ts
    │   ├── stringGenerators.ts
    │   ├── treeGenerators.ts
    │   ├── trieGenerators.ts
    │   ├── unionFindGenerators.ts
    │   └── additionalGenerators.ts
    ├── components/
    │   ├── layout/                # Navbar, Sidebar, CommandPalette
    │   ├── visualization/         # InputPanel, PlaybackControls, ExplanationPanel,
    │   │                          # StatsCard, Legend, StepLogPanel, WhyPopup, ComplexityChart
    │   ├── boards/                # 21 step-driven visual renderers
    │   ├── auth/                  # LoginModal, AdminDashboardModal (OTP + password + admin)
    │   ├── chat/                  # ChatDrawer, FloatingAskButton, MarkdownMessage
    │   ├── ui/                    # Badge, Button, Card, Dialog, Input, Slider, Tabs, Tooltip
    │   ├── canvas/                # StarfieldCanvas (global particle background)
    │   ├── aceternity/            # 3D card, background beams, spotlight
    │   └── magicui/               # Animated beam, border beam, number ticker, shimmer button
    ├── context/
    │   └── AuthContext.tsx        # Session restore, all auth API calls, modal state
    ├── data/
    │   ├── algorithmCode.ts       # C++/Java/Python implementations for the code viewer
    │   ├── leetCodeSolutions.ts
    │   └── observatorySteps.ts    # Curated demo steps for the landing showcase
    ├── lib/
    │   ├── audio.ts               # Web Audio sound engine
    │   ├── reasonUtils.ts         # Guarantees every step has a reason object
    │   └── utils.ts               # cn() helper
    ├── pages/
    │   ├── HomePage.tsx           # Landing + sign-in gateway + interactive showcase
    │   ├── TopicsPage.tsx         # Curriculum browser (DS + Algorithms)
    │   ├── VisualizerPage.tsx     # Observatory workspace
    │   ├── ProblemSolverPage.tsx  # Paste/upload problem -> AI plan -> visualization
    │   ├── ComparePage.tsx        # Side-by-side algorithm comparison
    │   └── ContestPage.tsx        # Contest list, arena, code editor, leaderboard
    ├── store/
    │   └── useAlgorithmStore.ts   # Algorithm, steps, playback, stats, settings, deep links
    ├── tests/
    │   ├── algorithmReason.test.ts    # Imported and run by main.tsx at startup
    │   ├── leetCodeSolver.test.ts
    │   ├── runCheck.ts
    │   └── viewportQA.test.ts
    └── types/
        ├── index.ts               # AlgorithmDefinition, StepAction, BoardType, StepReason
        ├── auth.ts                # User/payload contracts
        └── problemSolver.ts       # AI plan + visualizer step contracts
```

### Important folder purposes
- **`algorithms/`** — the product's core IP. Each algorithm is a pure generator yielding immutable step snapshots. It is independent of React and should not be touched by a UI redesign.
- **`components/boards/`** — the rendering layer for each visual primitive. All receive a `StepAction` and render `dataState`; they are the highest-risk redesign surface.
- **`components/visualization/`** — workspace chrome: input, playback, explanation, stats, legend, step log.
- **`store/`** — single orchestration point between algorithm engines and all UI. Changing its public shape breaks every board and panel.
- **`context/AuthContext.tsx`** — owns the auth contract, tokens and modal state.
- **`index.css`** — single source of design tokens. The new Aurora Learning system should replace/extend tokens here, not scatter values across components.

---

## 3. Website Pages

There are **6 in-app views**, not classic URL routes.

| View | File | Purpose | Access |
|---|---|---|---|
| `home` | `src/pages/HomePage.tsx` | Marketing-style landing: hero, portal sign-in cards, interactive multi-paradigm showcase (sliding window, DP, tree, graph), 3-step explainer, curriculum preview, "Why Engine" spotlight | Public |
| `topics` | `src/pages/TopicsPage.tsx` | Curriculum browser: Part 1 Data Structures + Part 2 Algorithms, search, filters, topic cards, launch into visualizer | Authenticated |
| `visualizer` | `src/pages/VisualizerPage.tsx` | Observatory workspace: algorithm sidebar, input bar, canvas board, legend, zoom, explanation/code panel, playback bar, AI chat | Authenticated |
| `solver` | `src/pages/ProblemSolverPage.tsx` | Paste/upload a LeetCode-style problem, auto-parse constraints, request an AI plan, synthesize a visual walkthrough with code/memory/console tabs | Authenticated |
| `compare` | `src/pages/ComparePage.tsx` | Side-by-side comparison of two approaches (e.g., brute force vs hash map) with synchronized playback | Authenticated |
| `contests` | `src/pages/ContestPage.tsx` | Contest hub: live/upcoming/completed filters, arena modal with timer, language selector, code editor, run/submit, leaderboard | Authenticated |

Access rules are enforced in `App.tsx`:
- Unauthenticated users see only `home`.
- Navbar links, command palette, AI drawer and all non-home views are gated.
- Query `?view=` is validated and stripped when unauthenticated; the login modal opens instead.

### Shared components

**Global shell**
- `components/layout/Navbar.tsx` — brand, view navigation, search trigger, Ask AI, sound, theme, profile menu, auth buttons.
- `components/canvas/StarfieldCanvas.tsx` — fixed atmospheric background.
- `components/layout/CommandPalette.tsx` — Ctrl/Cmd+K algorithm search and jump.
- `components/chat/ChatDrawer.tsx` — streaming AI mentor drawer (SSE).
- `components/chat/FloatingAskButton.tsx` — floating entry point inside visualizer.
- `components/auth/LoginModal.tsx` — student/admin OTP + password flows.
- `components/auth/AdminDashboardModal.tsx` — admin analytics, contest and question management.

**Workspace**
- `components/layout/Sidebar.tsx` — collapsible curriculum tree (only used in Visualizer).
- `components/visualization/InputPanel.tsx` — custom input, randomize, presets, validation errors.
- `components/visualization/PlaybackControls.tsx` — scrubber, play/pause, step, reset, speed, sound, auto-pause, keyboard shortcuts.
- `components/visualization/ExplanationPanel.tsx` — pseudocode/code/why/quiz/step log tabs.
- `components/visualization/StatsCard.tsx` — context-aware metrics per algorithm family.
- `components/visualization/Legend.tsx` — semantic color legend.
- `components/visualization/StepLogPanel.tsx` — ordered step history.
- `components/visualization/WhyPopup.tsx` — per-step "why did this happen?" popover.
- `components/visualization/ComplexityChart.tsx` — Recharts comparisons/swaps curve.

**Boards (18 components / 21 boardType variants)**
`ActivityTimelineBoard`, `ArraySearchBoard`, `ArraySortBoard`, `BacktrackingBoard`, `BitBoard`, `DisjointSetBoard`, `DivideConquerBoard`, `DPTableBoard`, `GraphBoard`, `GridBoard`, `HashTableBoard`, `HeapDualBoard`, `LinkedListBoard`, `RecursionBoard`, `StackQueueBoard`, `StringBoard`, `TreeGraphBoard`, `TrieBoard` and variants.

**Primitives**
`ui/badge`, `ui/button`, `ui/card`, `ui/dialog`, `ui/input`, `ui/slider`, `ui/tabs`, `ui/tooltip`.
Decorative: `aceternity/3d-card`, `background-beams`, `spotlight`; `magicui/animated-beam`, `border-beam`, `number-ticker`, `shimmer-button`.

**There is no footer and no persistent app sidebar.** Navigation is entirely top-nav + modals/drawers.

---

## 4. UI/UX Analysis

### Existing visual direction
Two competing directions coexist:

1. **"Warm Ivory" light theme (default)**
   - Background `#faf8f5`, cards `#ffffff`, primary blue `#2563eb`.
   - Rounded `0.85rem`, crisp borders `#e2e8f0`.
2. **"Kinetic Observatory" / Night-Sky dark theme**
   - Background `#070b16`, surfaces `#10182f` to `#24355d`.
   - Primary purple `#a855f7`, secondary cyan `#38bdf8`, tertiary green `#10b981`.
   - Glassmorphism, neon cyan/purple glows, particle starfield.
3. A **third, hard-coded neon layer** appears in workspace components: `bg-black/40`, `text-cyan-400`, `border-white/10`, `bg-[#0b1020]/80`, `bg-cyan-500`.

### Typography
- Headings: **Bricolage Grotesque** (loaded via Google Fonts, declared as `--font-heading`).
- Body: **Plus Jakarta Sans**.
- Code: **JetBrains Mono**.
- **Bug:** global `h1–h6` rule uses `'Space Grotesk'`, which is neither loaded nor declared. Headings only look correct where a `font-heading`/`font-display-*` class overrides the rule.
- Material Symbols is loaded in `index.html` but not used by any React component (Lucide is used everywhere).
- Many labels are 10–11 px; several icon-only controls lack visible labels.

### Layout
- Desktop-first, app-sized shell: `h-dvh`, `overflow-hidden`, internal scroll regions.
- Visualizer: 320 px collapsible sidebar + fluid canvas + 35–38% right explanation panel (min 340 px) + sticky bottom playback bar.
- Mobile: sidebar/drawer patterns, 80vh code drawer, compact header. Several fixed heights and min-widths create risk on small screens.
- Topics/Home/Compare/Solver/Contest are long-scroll pages with atmospheric glows and card grids.

### Inconsistent / problematic design
1. **Three palettes at once** — shadcn HSL tokens, Observatory hex tokens, and hard-coded Tailwind neon classes.
2. **Light/dark leakage** — dark-only utilities (`border-white/10`, `text-cyan-400`, `bg-black/40`) render in light mode with poor contrast.
3. **Body background mismatch** — `body` is forced to `#05070f` with cyan/indigo radial gradients, while the app shell uses `bg-background` (`#faf8f5` in light mode).
4. **Heading font mismatch** — `Space Grotesk` referenced but not loaded; Bricolage is loaded.
5. **Radius drift** — `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`, and hard-coded `1rem/2rem/3rem` from the mockup.
6. **Spacing drift** — semantic `px-margin-lg`/`gap-space-*` tokens mixed with raw `p-2`, `p-4`, `px-3`.
7. **Icon system drift** — Lucide vs Material Symbols (loaded only in HTML) vs emoji-style glyphs.
8. **Typography scale drift** — ad-hoc `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm` instead of the declared `display/headline/body/label/code` scale.
9. **Oversized single-file pages** — Home 864 lines, ProblemSolver 1,161, Contest 803, Compare 732, Topics 534; hard to restyle safely.
10. **State-dependent chrome** — the visualizer header changes completely between paused and playing states.
11. **Accessibility gaps** — very small text, muted-on-tinted contrast, unlabeled icon buttons, focus treatment inconsistencies; reduced-motion CSS exists but not all JS animations respect it.
12. **No global design-token documentation**; token meanings (semantic visualization colors) are implicit.

### Components that need redesign (priority)
**P0 (shell & core workspace)**
- Navbar, Sidebar, PlaybackControls, InputPanel, StatsCard, ExplanationPanel, Legend.
- Visualizer canvas container and zoom/fit toolbar.
- LoginModal + AdminDashboardModal (largest, most complex surfaces).

**P0 (data display)**
- All 18 board components (21 boardType variants) — preserve the visual semantics (compare/swap/found/visited/discarded) while replacing chrome.
- WhyPopup, StepLogPanel, ComplexityChart.

**P1 (pages)**
- HomePage hero + showcase, TopicsPage cards/filters, ComparePage dashboard, ProblemSolverPage workspace, ContestPage arena.

**P1 (feedback)**
- Chat drawer, command palette, toasts/errors (currently inline banners only).

**P2**
- Decorative Aceternity/MagicUI wrappers, empty states, loading states.

---

## 5. Algorithm Visualizer — How It Works

### Execution pipeline

1. **Definition** — every algorithm is an `AlgorithmDefinition` (`src/types/index.ts`) with metadata, complexity, pseudocode, `defaultInput`, presets, random-input generator, validator, optional quiz, and a `run(input)` **generator**.
2. **Generator output** — each `yield` returns a `StepAction`:
   - `type`: `start | compare | swap | sorted | found | not-found | discard | pointer | visit | set | step | mismatch | highlight | push | pop | enqueue | dequeue | insert | delete | rotate | call | return | backtrack | bit-toggle | complete`
   - `indices`, `pointers`, `discardedIndices`, `gridCell`, `visitedCells`, `bitIndex`
   - `dataState`: immutable snapshot consumed by the active board
   - `codeLine`: 1-based pseudocode line to highlight
   - `message`, `reason { action, why, rule, values, details }`
   - cumulative `comparisonsCount`, `swapsCount`
3. **Pre-computation** — `computeSteps()` in `src/store/useAlgorithmStore.ts` drains the generator into an array, normalizes every reason through `ensureStepReason()`, and records cumulative counters. This enables instant scrubbing, backwards stepping, and charts.
4. **Orchestration** — Zustand store holds `currentAlgorithm`, `input`, `steps`, `currentStepIndex`, `isPlaying`, `speed`, `comparisons`, `swaps`, `chartData`, display settings, and compare algorithm id.
5. **Rendering** — `VisualizerPage.renderBoard()` switches on `currentAlgorithm.boardType` and passes the current `StepAction` to one of 18 board components. Each board renders `step.dataState` and highlights `indices`/`pointers`.
6. **Playback** — `PlaybackControls` runs a `setInterval` at `max(25, 1000 / speed)` ms while `isPlaying`; speed range 0.25×–4×. Actions: play/pause, step forward/back, jump via scrubber, reset. Auto-pause on `found`, `swap`, `rotate` is configurable.
7. **Keyboard shortcuts** — `Space` play/pause, `←/→` step, `R` reset, `M` mute (ignored while typing in inputs/textareas).
8. **Persistence** — algorithm id + input are written to `localStorage` (`algoviz_last_state`) and the URL (`?algo=&input=`), restored on mount. Theme key: `algoviz_theme`.
9. **Synthesis feedback** — Web Audio tones per step type (`src/lib/audio.ts`); completion confetti; `chartData` feeds `ComplexityChart`.

### Code editor vs code viewer
- **No Monaco/CodeMirror.** The Observatory's "code editor" is a **read-only, line-highlighted code viewer**:
  - Pseudocode comes from `currentAlgorithm.pseudocode`.
  - C++ / Java / Python snippets come from `src/data/algorithmCode.ts`.
  - Language tabs + copy-to-clipboard live in `ExplanationPanel.tsx`.
  - Active line follows `step.codeLine` and auto-scrolls.
- **Editable code exists only in two places**, both plain controlled `<textarea>`/`<pre>` surfaces:
  - `ContestPage.tsx` — language starter templates, run sample tests, submit.
  - `ProblemSolverPage.tsx` — generated solution code tab.
- There is **no execution sandbox**; "Run sample tests" is a simulated client-side state transition, and contest submission posts metadata to the backend.

### Key files
| Responsibility | File |
|---|---|
| Step and algorithm contracts | `src/types/index.ts` |
| Registry (20 categories / 58 algorithms) | `src/algorithms/registry.ts` |
| Algorithm generators | `src/algorithms/**` |
| Step pre-computation, playback, persistence | `src/store/useAlgorithmStore.ts` |
| Board dispatch + zoom/fit | `src/pages/VisualizerPage.tsx` |
| Playback UI + timer + shortcuts | `src/components/visualization/PlaybackControls.tsx` |
| Input/presets/validation | `src/components/visualization/InputPanel.tsx` |
| Code/pseudocode/quiz tabs | `src/components/visualization/ExplanationPanel.tsx` |
| Metrics | `src/components/visualization/StatsCard.tsx` |
| Visual primitives | `src/components/boards/*.tsx` |
| Code snippets | `src/data/algorithmCode.ts` |
| Reason normalization | `src/lib/reasonUtils.ts` |
| Audio | `src/lib/audio.ts` |

---

## 6. Backend & Integrations

> No API keys, passwords, tokens, connection strings or `.env` values are reproduced in this audit.

### Frontend-consumed endpoints

| Method | Endpoint | Purpose | Used by |
|---|---|---|---|
| POST | `/api/auth/send-otp` | Send email OTP (hashed, expiring, attempt-limited) | `AuthContext.sendOtp` |
| POST | `/api/auth/verify-otp` | Verify OTP without creating session | Backend route (not called by current UI) |
| POST | `/api/auth/student-login` | Student registration/sign-in with OTP, returns session token + user | `AuthContext.loginStudent` |
| POST | `/api/auth/student-password-login` | Direct student login (College ID/email + password) | `AuthContext.loginStudentWithPassword` |
| POST | `/api/auth/admin-login` | Admin login via OTP | `AuthContext.loginAdmin` |
| POST | `/api/auth/admin-password-login` | Direct admin login | `AuthContext.loginAdminWithPassword` |
| GET | `/api/auth/me` | Validate stored token and refresh user | `AuthContext` session restore |
| POST | `/api/auth/logout` | Invalidate session | `AuthContext.logout` |
| GET | `/api/auth/admin/students` | Paginated student directory (admin RBAC) | `AdminDashboardModal` |
| GET | `/api/contests` | List contests | `ContestPage` |
| GET | `/api/contests/:id` | Contest detail + questions | Contest service |
| GET | `/api/contests/:id/leaderboard` | Ranked submissions | `ContestPage` |
| POST | `/api/contests/submit` | Submit solution metadata, update score | `ContestPage` |
| POST | `/api/admin/contests` | Create contest (admin) | `AdminDashboardModal` |
| POST | `/api/admin/questions` | Add question (admin) | `AdminDashboardModal` |
| GET | `/api/admin/questions` | List question bank (admin) | `AdminDashboardModal` |
| GET | `/api/admin/analytics` | Branch / participation analytics (admin) | `AdminDashboardModal` |
| POST | `/api/chat` | SSE-streamed AI mentor and problem-solver plans; tool-call actions for playback; per-IP rate limit (25 req/min) | `ChatDrawer`, `ProblemSolverPage` |

### Authentication
- Custom **opaque 256-bit session tokens** (`crypto.randomBytes(32)`), stored in `sessions` (Mongo) or JSON fallback, sent as `Authorization: Bearer <token>`.
- Passwords: PBKDF2-SHA512, 210,000 iterations, per-user salt.
- OTP: SHA-256 hash, expiry + attempt limit, in-memory.
- Client stores `algoviz_auth_token` and `algoviz_auth_user` in `localStorage`; cross-tab sync via the `storage` event.
- Admin access is role-checked server-side (`students`/`admins` collections, admin endpoints return 403 for non-admins).
- The backend seeds demo student/admin records on first run; credentials are intentionally omitted here and must never be exposed in UI docs or handoff assets.

### Database integration
- `backend/api/db.js` connects to MongoDB Atlas if `MONGODB_URI` exists; otherwise logs a warning and falls back to atomic JSON files under `backend/data/`.
- Indexes: unique `students.collegeId`, `admins.email`, `sessions.token`; TTL cleanup of expired sessions.
- Contest data uses `contests`, `submissions`, `questions` collections with the same JSON fallback.

### Must not break during a UI redesign
1. All `fetch()` paths listed above and their request/response shapes.
2. `AuthContext` public API: `user`, `token`, `isAuthenticated`, `isAdmin`, `sendOtp`, `loginStudent`, `loginStudentWithPassword`, `loginAdmin`, `loginAdminWithPassword`, `logout`, modal controls.
3. `useAlgorithmStore` public API and its state field names.
4. `StepAction` / `AlgorithmDefinition` / `BoardType` contracts and the `boardType` → board mapping.
5. URL parameters `view`, `algo`, `input`; localStorage keys `algoviz_theme`, `algoviz_last_state`, `algoviz_sound_muted`, `algoviz_auth_token`, `algoviz_auth_user`.
6. SSE stream protocol for `/api/chat` (chunked text + tool-action JSON) and the problem-solver plan schema.
7. Contest submission payload (`contestId`, `questionId`, `code`, `language`, `passCount`, `totalTests`).
8. Keyboard shortcuts and the auth gating rules (unauthenticated users confined to Home).
9. Backend static serving expects the production build in `frontend/dist`.

---

## 7. Important Files for an External UI/UX Engineer

Paths are relative to `AlgoviZ_CLONE_FRESH/frontend/`.

### Entry, shell, styling
```
index.html
package.json
tsconfig.json
vite.config.ts
public/logo.svg
src/main.tsx
src/App.tsx
src/index.css
src/lib/utils.ts
```

### Pages
```
src/pages/HomePage.tsx
src/pages/TopicsPage.tsx
src/pages/VisualizerPage.tsx
src/pages/ProblemSolverPage.tsx
src/pages/ComparePage.tsx
src/pages/ContestPage.tsx
```

### Layout & global overlays
```
src/components/layout/Navbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/CommandPalette.tsx
src/components/canvas/StarfieldCanvas.tsx
src/components/auth/LoginModal.tsx
src/components/auth/AdminDashboardModal.tsx
src/components/chat/ChatDrawer.tsx
src/components/chat/FloatingAskButton.tsx
src/components/chat/MarkdownMessage.tsx
```

### Visualization workspace
```
src/components/visualization/InputPanel.tsx
src/components/visualization/PlaybackControls.tsx
src/components/visualization/ExplanationPanel.tsx
src/components/visualization/StatsCard.tsx
src/components/visualization/Legend.tsx
src/components/visualization/StepLogPanel.tsx
src/components/visualization/WhyPopup.tsx
src/components/visualization/ComplexityChart.tsx
```

### Boards
```
src/components/boards/*.tsx   (18 files)
```

### UI primitives & decorative components
```
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/dialog.tsx
src/components/ui/input.tsx
src/components/ui/slider.tsx
src/components/ui/tabs.tsx
src/components/ui/tooltip.tsx
src/components/aceternity/3d-card.tsx
src/components/aceternity/background-beams.tsx
src/components/aceternity/spotlight.tsx
src/components/magicui/animated-beam.tsx
src/components/magicui/border-beam.tsx
src/components/magicui/number-ticker.tsx
src/components/magicui/shimmer-button.tsx
```

### State, contracts, data, integrations
```
src/store/useAlgorithmStore.ts
src/context/AuthContext.tsx
src/types/index.ts
src/types/auth.ts
src/types/problemSolver.ts
src/algorithms/registry.ts
src/data/algorithmCode.ts
src/data/observatorySteps.ts
src/lib/reasonUtils.ts
src/lib/audio.ts
```

### Reference
```
AlgoviZ_CLONE_FRESH/stitch_algoviz_learning_observatory/solve_a_problem_algoviz/code.html
```

**Do not send:** `node_modules/`, `.git/`, `dist/`, `package-lock.json` (optional), `backend/`, `backend/data/`, any `.env`/`main.env`, `tsconfig.tsbuildinfo`, or `scripts/` test harnesses unless requested.

---

## 8. Potential Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Store contract changes | Every board, panel and page breaks | Treat `useAlgorithmStore` as a frozen API; restyle around it |
| `boardType` mapping | Wrong board or crash on algorithm switch | Preserve all 21 boardType cases in `VisualizerPage.renderBoard()` |
| Token renaming in `index.css` | Hundreds of utility classes break (e.g., `bg-surface-container`, `text-on-surface`) | Add Aurora tokens alongside existing ones, then migrate incrementally |
| Tailwind v4 CSS-first setup | A classic `tailwind.config.js` will not be picked up | Keep tokens in `@theme` inside `index.css` |
| Light/dark divergence | Dark-only classes become unreadable in light mode | Introduce semantic tokens and remove raw white/black/cyan utilities |
| Auth gating | Unauthenticated users could reach protected views or lose access | Keep `App.tsx` gating logic and `AuthContext` unchanged |
| Query-param deep links | Shared visualizer links break | Preserve `view`, `algo`, `input` handling |
| SSE chat protocol | AI drawer and solver stop streaming | Do not alter `/api/chat` parsing or tool-action handling |
| Oversized page components | High regression risk when restyling | Refactor into subcomponents before visual changes (separate PR) |
| 21 hand-built boards | Inconsistent redesign, clipped layouts | Define a shared board frame + semantic color API; restyle one family at a time |
| Fixed heights / min-widths | Mobile clipping, especially visualizer | Audit at 360/390/768/1024/1440 px; replace fixed values with responsive constraints |
| Single SVG asset | No brand illustration system for the new design | Add Aurora asset set; keep `logo.svg` favicon path until replaced |
| Startup test import in `main.tsx` | Removing `src/tests` breaks boot | Keep the file or decouple validation from app bootstrap |
| Installed-but-unused deps | Bundle/config confusion | Remove `@xyflow/react` and `zod` only after confirming zero imports |
| Backend serves `frontend/dist` | Production deploy breaks if output path changes | Keep `vite build` output at `frontend/dist` |
| Secrets | `.env` and demo credentials must never ship | Handoff excludes all env files and backend data |

---

## Appendix A — Design Tokens (current)

**Light (`:root`)**
```
background #faf8f5   foreground #0f172a   card #ffffff
primary #2563eb      secondary #f1ede6     muted #f2eee7
border #e2e8f0       ring #2563eb          radius 0.85rem
comparing #f59e0b    pointer #2563eb      swap #c026d3
found #10b981        visited #818cf8       discarded #cbd5e1
error #f43f5e
```

**Dark (`.dark`)**
```
background #05070f   card #0b1020         surface #070b16
primary #a855f7      secondary #38bdf8    tertiary #10b981
outline #54688d      on-surface #e8edf8   on-surface-variant #9caec9
comparing #f59e0b    pointer #06b6d4      swap #c026d3
found #eab308        visited #818cf8       discarded #334155
```

**Typography**
```
Display/Headings  Bricolage Grotesque  (loaded)
Body/Labels       Plus Jakarta Sans
Code              JetBrains Mono
```

**Spacing scale** `space-2xs` 0.25rem → `space-3xl` 4rem; gutters 1 / 1.5 / 2rem; margins 1 / 2 / 3rem.

---

## Appendix B — Audit Method

- Recursive file listing (excluding `node_modules`, `.git`, `dist`).
- Read of entry points, all pages, store, auth context, visualization components, registry, types, backend router and handlers.
- Cross-reference of every frontend `fetch()` call against backend routes.
- Token extraction from `src/index.css`.
- No execution of the app and no writes to the existing project.

