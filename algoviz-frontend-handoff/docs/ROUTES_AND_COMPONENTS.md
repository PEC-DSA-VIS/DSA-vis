# Routes, Views & Component Map

AlgoViz has **no React Router**. The entire app is a state machine in `src/App.tsx` driven by `NavView` and synchronized to `?view=`.

---

## 1. Views

| `NavView` | Page component | URL | Access | Primary purpose |
|---|---|---|---|---|
| `home` | `pages/HomePage.tsx` | `?view=home` | Public | Landing, portal sign-in, interactive showcase |
| `topics` | `pages/TopicsPage.tsx` | `?view=topics` | Auth | Curriculum browser and algorithm launcher |
| `visualizer` | `pages/VisualizerPage.tsx` | `?view=visualizer&algo=&input=` | Auth | Step-by-step algorithm workspace |
| `solver` | `pages/ProblemSolverPage.tsx` | `?view=solver` | Auth | Paste/upload problem → AI plan → synthesized walkthrough |
| `compare` | `pages/ComparePage.tsx` | `?view=compare` | Auth | Two-approach side-by-side comparison |
| `contests` | `pages/ContestPage.tsx` | `?view=contests` | Auth | Contest hub, arena, code editor, leaderboard |

Access enforcement:
- Unauthenticated → forced to `home`; `?view` is removed and the login modal opens.
- Navbar internal links, Ctrl/Cmd+K, AI drawer and all non-home views are gated.
- `?algo` / `?input` deep links are restored by `useAlgorithmStore.loadFromUrlOrStorage()`.

## 2. App shell

```
src/App.tsx
├── AuthProvider
└── AppShell
    ├── StarfieldCanvas                 (fixed atmospheric background)
    ├── Navbar                          (global)
    ├── view container
    │   ├── HomePage
    │   ├── TopicsPage
    │   ├── VisualizerPage
    │   ├── ProblemSolverPage
    │   ├── ComparePage
    │   └── ContestPage
    ├── CommandPalette                  (auth only)
    ├── ChatDrawer                      (auth only)
    ├── LoginModal                      (global)
    └── AdminDashboardModal             (global)
```

Theme is managed in `App.tsx` (`localStorage: algoviz_theme`, default **light**) by toggling `.dark` on `<html>`.

## 3. Component inventory

### 3.1 Shell / navigation
| Component | File | Notes |
|---|---|---|
| Navbar | `components/layout/Navbar.tsx` | Brand, 5 nav links, search trigger, Ask AI, sound, theme, profile, auth |
| Sidebar | `components/layout/Sidebar.tsx` | 320 px collapsible curriculum tree; visualizer only |
| CommandPalette | `components/layout/CommandPalette.tsx` | Ctrl/Cmd+K algorithm search and jump |
| StarfieldCanvas | `components/canvas/StarfieldCanvas.tsx` | Canvas particle background |

### 3.2 Overlays
| Component | File | Notes |
|---|---|---|
| LoginModal | `components/auth/LoginModal.tsx` | Student/admin, OTP + password, ~52 KB |
| AdminDashboardModal | `components/auth/AdminDashboardModal.tsx` | Analytics, contests, question bank, students, ~54 KB |
| ChatDrawer | `components/chat/ChatDrawer.tsx` | SSE streaming AI mentor, context-aware |
| FloatingAskButton | `components/chat/FloatingAskButton.tsx` | Visualizer entry point |
| MarkdownMessage | `components/chat/MarkdownMessage.tsx` | Markdown renderer for AI output |

### 3.3 Visualizer workspace
| Component | File | Reads from store |
|---|---|---|
| InputPanel | `components/visualization/InputPanel.tsx` | `currentAlgorithm`, `input`, `inputError`, `setInput`, `generateRandomInput`, `setPreset` |
| PlaybackControls | `components/visualization/PlaybackControls.tsx` | `steps`, `currentStepIndex`, `isPlaying`, `speed`, `soundMuted`, `autoPauseImportant`, `whyDisplayMode` + actions |
| ExplanationPanel | `components/visualization/ExplanationPanel.tsx` | `currentAlgorithm`, `steps`, `currentStepIndex`, `isPlaying`; tabs: pseudocode, code, why, quiz, step log |
| StatsCard | `components/visualization/StatsCard.tsx` | `comparisons`, `swaps`, `currentStepIndex`, `steps`, `currentAlgorithm` |
| Legend | `components/visualization/Legend.tsx` | Semantic visualization colors |
| StepLogPanel | `components/visualization/StepLogPanel.tsx` | `steps`, `currentStepIndex` |
| WhyPopup | `components/visualization/WhyPopup.tsx` | `step.reason` |
| ComplexityChart | `components/visualization/ComplexityChart.tsx` | `chartData` (Recharts area chart) |

### 3.4 Boards (render `StepAction`)
| Board | File | Used for |
|---|---|---|
| ArraySearchBoard | `boards/ArraySearchBoard.tsx` | Linear/binary search, two pointers, windows |
| ArraySortBoard | `boards/ArraySortBoard.tsx` | Bubble/insertion/quick/merge/heap sort |
| GridBoard | `boards/GridBoard.tsx` | Matrix traversal and grids |
| GraphBoard | `boards/GraphBoard.tsx` | BFS/DFS/Dijkstra/topological sort |
| LinkedListBoard | `boards/LinkedListBoard.tsx` | Singly/doubly linked lists |
| StackQueueBoard | `boards/StackQueueBoard.tsx` | Stack and queue operations |
| BitBoard | `boards/BitBoard.tsx` | Bit manipulation |
| TreeGraphBoard | `boards/TreeGraphBoard.tsx` | BST/AVL/segment trees |
| HeapDualBoard | `boards/HeapDualBoard.tsx` | Heap tree + array |
| DPTableBoard | `boards/DPTableBoard.tsx` | DP matrices |
| StringBoard | `boards/StringBoard.tsx` | String operations |
| TrieBoard | `boards/TrieBoard.tsx` | Trie construction/search |
| DisjointSetBoard | `boards/DisjointSetBoard.tsx` | Union-Find |
| RecursionBoard | `boards/RecursionBoard.tsx` | Recursion trees |
| DivideConquerBoard | `boards/DivideConquerBoard.tsx` | Divide & conquer, merge-sort trees |
| BacktrackingBoard | `boards/BacktrackingBoard.tsx` | N-Queens, Sudoku |
| ActivityTimelineBoard | `boards/ActivityTimelineBoard.tsx` | Activity selection / timelines |
| HashTableBoard | `boards/HashTableBoard.tsx` | Hash tables, collisions |
| (variants) | `GridBoard`, `TreeGraphBoard` used via `boardType` aliases | see `VisualizerPage.renderBoard()` |

### 3.5 UI primitives
`components/ui/badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `slider.tsx`, `tabs.tsx`, `tooltip.tsx`.

### 3.6 Decorative
`aceternity/3d-card.tsx`, `background-beams.tsx`, `spotlight.tsx`; `magicui/animated-beam.tsx`, `border-beam.tsx`, `number-ticker.tsx`, `shimmer-button.tsx`.

## 4. Page anatomy (for redesign scoping)

### Home (`HomePage.tsx`, 864 lines)
Hero + eyebrow + CTAs + stats → sign-in portal cards (student/faculty) → interactive multi-paradigm showcase (sliding window, DP, tree, graph + terminal + scrubber) → 3-step feature section → curriculum preview → "Why Engine" spotlight.

### Topics (`TopicsPage.tsx`, 534 lines)
Header/breadcrumbs → quick-jump anchors → metric strip → search + scope/status filters + keyword pills → Part 1 Data Structures grid → Part 2 Algorithms grid → launch actions.

### Visualizer (`VisualizerPage.tsx`, 409 lines)
Input bar (hidden while playing) → sidebar → header (paused/playing variants) → stats → canvas toolbar (legend, zoom, fit) → board → explanation panel (desktop) / drawer (mobile) → sticky playback bar → AI chat.

### Problem Solver (`ProblemSolverPage.tsx`, 1,161 lines)
Problem input/upload + OCR simulation → auto-detected metadata → "synthesize" action → AI plan → visualization canvas → console/code/memory tabs → fallback explanation.

### Compare (`ComparePage.tsx`, 732 lines)
Problem configuration bar (problem switcher, target, dataset) → synchronized playback deck → two approach columns with step traces → insight/verdict panels.

### Contests (`ContestPage.tsx`, 803 lines)
Contest header + filters/search → contest cards → arena modal (timer, question tabs, language selector, code editor, run/submit, results) → leaderboard tab.

## 5. Shared state & contracts

- **Zustand store:** `src/store/useAlgorithmStore.ts` — single source for algorithm, steps, playback and display settings.
- **Auth context:** `src/context/AuthContext.tsx` — session, user, modal state, all auth requests.
- **Types:** `src/types/index.ts`, `auth.ts`, `problemSolver.ts`.
- **Registry:** `src/algorithms/registry.ts` — 20 categories, 58 algorithms, search.

## 6. Component redesign order

1. `ui/*` primitives
2. `Navbar`, `CommandPalette`
3. `LoginModal`, `AdminDashboardModal`, `ChatDrawer`
4. `InputPanel`, `StatsCard`, `Legend`, `PlaybackControls`, `ExplanationPanel`
5. Boards, family by family
6. `HomePage`, `TopicsPage`, `ComparePage`, `ProblemSolverPage`, `ContestPage`
7. Decorative and empty/loading states
