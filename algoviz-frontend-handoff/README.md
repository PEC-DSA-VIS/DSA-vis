# AlgoViz — Frontend Redesign Handoff

**Design system target:** Aurora Learning  
**Source:** `AlgoviZ_CLONE_FRESH/frontend` (newest copy, 07 Nov 2026)  
**Audit:** [`docs/ALGOVIZ_PROJECT_AUDIT.md`](docs/ALGOVIZ_PROJECT_AUDIT.md)

This package contains everything an external UI/UX engineer needs to redesign the AlgoViz frontend without touching algorithm engines, authentication, or backend code.

---

## 1. What is included

```
algoviz-frontend-handoff/
├── README.md
├── docs/
│   ├── ALGOVIZ_PROJECT_AUDIT.md      # Full project audit
│   ├── API_INTEGRATION.md            # Endpoints, auth flow, data contracts
│   ├── DESIGN_SYSTEM_HANDOFF.md      # Current tokens, fonts, inconsistencies, redesign rules
│   ├── ROUTES_AND_COMPONENTS.md      # Views, shared components, component ownership
│   └── FILE_MANIFEST.md              # Every file shipped, with size
├── frontend/                         # Complete relevant frontend source
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── public/logo.svg
│   └── src/                          # pages, components, styles, tokens, store, types, data
└── design-reference/
    └── stitch_algoviz_learning_observatory/
        └── solve_a_problem_algoviz/code.html   # Static Observatory mockup (reference only)
```

**112 files · 1,958,186 bytes (~1.87 MB) uncompressed** (before zip).

## 2. What is intentionally excluded

- `node_modules/`, `.git/`, `dist/`, build caches
- `.env`, `.env.*`, `main.env`, any secret or credential
- `package-lock.json` (generated; run `npm install` to recreate)
- `tsconfig.tsbuildinfo` and other generated artifacts
- Entire `backend/` and `backend/data/` (API contracts are documented instead)
- Frontend `scripts/` and `src/tests/` QA harnesses

`src/tests/algorithmReason.test.ts` **is retained** because `src/main.tsx` imports and runs it at boot. Removing it breaks the app.

## 3. Run the handoff locally

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:3001`. Without the backend, the UI still renders; login, chat, contest and admin calls will fail gracefully or show errors.

Production build:

```bash
npm run build        # outputs frontend/dist
npm run preview
```

## 4. Redesign rules (non-negotiable)

1. **Do not change** `src/algorithms/**`, `src/store/useAlgorithmStore.ts`, `src/context/AuthContext.tsx`, or `src/types/**` behavior. Restyle around them.
2. **Preserve** `boardType` → board mapping in `src/pages/VisualizerPage.tsx` (21 cases).
3. **Preserve** all `fetch()` paths and payload shapes documented in `docs/API_INTEGRATION.md`.
4. **Preserve** URL params `view`, `algo`, `input` and localStorage keys.
5. **Keep** auth gating in `src/App.tsx` (unauthenticated users only see Home).
6. **Add** Aurora tokens alongside existing CSS variables in `src/index.css`; migrate components incrementally. Tailwind v4 is CSS-first — do not add a `tailwind.config.js`.
7. **Keep** semantic visualization colors (`comparing`, `pointer`, `swap`, `found`, `visited`, `discarded`, `error`). They carry meaning in every board.
8. **Keep** keyboard shortcuts and `prefers-reduced-motion` behavior.
9. **Do not** expose demo credentials or env values in UI copy, comments, screenshots, or docs.
10. **Test** at 360, 390, 768, 1024 and 1440 px. The visualizer uses fixed panel widths and minimum heights.

## 5. Highest-risk surfaces

| Surface | Why |
|---|---|
| `src/index.css` | Single source of tokens; renaming breaks hundreds of utilities |
| `src/store/useAlgorithmStore.ts` | Every board and panel depends on its field names |
| `src/components/boards/*` | 18 bespoke board components; semantic colors and snapshot shape are load-bearing |
| `src/App.tsx` | Auth gate, view switching, theme, global modals |
| `src/context/AuthContext.tsx` | Session restore and all auth requests |
| `src/components/visualization/PlaybackControls.tsx` | Timer, shortcuts, auto-pause logic |
| `src/components/chat/ChatDrawer.tsx` | SSE stream parsing and tool-action handling |

## 6. Deliverable expectations for the designer

- Aurora Learning token sheet (color, type, spacing, radius, elevation, motion) mapped onto the existing variables.
- Light and dark themes with WCAG AA contrast for body text and controls.
- Redesigned shell (Navbar, command palette, chat drawer, auth modals).
- Redesigned visualizer workspace + board frame + playback bar.
- Redesigned pages: Home, Topics, Visualizer, Problem Solver, Compare, Contests.
- Responsive specs for the breakpoints above.
- Component states: default, hover, focus-visible, active, disabled, loading, empty, error.
- Handoff artifacts: Figma (or equivalent) + token JSON/CSS + annotated component specs.

## 7. Source provenance

The workspace contained two copies. This package is built only from the newer `AlgoviZ_CLONE_FRESH/frontend`. The older `DSA-vis/frontend` was **not** modified and is not included. No file in either original project was changed, deleted, or renamed.

