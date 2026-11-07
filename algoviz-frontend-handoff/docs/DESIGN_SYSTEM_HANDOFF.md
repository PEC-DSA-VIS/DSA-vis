# Design System Handoff — Current State → Aurora Learning

Source of truth for tokens: `frontend/src/index.css` (Tailwind v4 CSS-first, `@theme`).
There is **no** `tailwind.config.js`.

---

## 1. Current token inventory

### 1.1 Brand / semantic (shadcn-style HSL variables)

| Token | Light | Dark |
|---|---|---|
| `--background` | `36 33% 97%` (#faf8f5) | `224 71% 4%` (#05070f) |
| `--foreground` | `222 47% 11%` (#0f172a) | `210 40% 98%` |
| `--card` | `0 0% 100%` | `224 45% 8%` (#0b1020) |
| `--popover` | `0 0% 100%` | `224 45% 8%` |
| `--primary` | `221 83% 53%` (#2563eb) | `189 94% 43%` (cyan) |
| `--primary-foreground` | `0 0% 100%` | `224 71% 4%` |
| `--secondary` | `36 20% 93%` | `224 35% 14%` |
| `--muted` | `36 20% 94%` | `224 35% 12%` |
| `--muted-foreground` | `215 16% 47%` (#64748b) | `215 20% 65%` |
| `--accent` | `221 83% 96%` | `224 35% 16%` |
| `--destructive` | `348 83% 61%` | `348 83% 61%` |
| `--border` / `--input` | `220 13% 89%` | `224 30% 16%` |
| `--ring` | `221 83% 53%` | `189 94% 43%` |
| `--radius` | `0.85rem` | same |

> Note: in `@theme`, `--color-primary` is remapped to `--obs-primary` (Observatory purple), **not** `hsl(var(--primary))`. The old blue is exposed as `--color-primary-legacy`. This double meaning is a redesign hazard — unify it.

### 1.2 Observatory palette (hex)

| Group | Light | Dark |
|---|---|---|
| `--surface` | `#f8f9ff` | `#070b16` |
| `--surface-container-lowest` | `#ffffff` | `#0b1020` |
| `--surface-container-low` | `#eff4ff` | `#10182f` |
| `--surface-container` | `#e5eeff` | `#16213d` |
| `--surface-container-high` | `#dce9ff` | `#1c2a4c` |
| `--surface-container-highest` | `#d3e4fe` | `#24355d` |
| `--on-surface` | `#0b1c30` | `#e8edf8` |
| `--on-surface-variant` | `#4a4455` | `#9caec9` |
| `--outline` | `#7b7487` | `#54688d` |
| `--outline-variant` | `#ccc3d8` | `#1e2c47` |
| `--obs-primary` | `#630ed4` | `#a855f7` |
| `--obs-primary-container` | `#7c3aed` | `#581c87` |
| `--obs-secondary` | `#006398` | `#38bdf8` |
| `--obs-tertiary` | `#005a3d` | `#10b981` |
| `--obs-error` | `#ba1a1a` | `#f43f5e` |

### 1.3 Visualization semantics — **must remain meaningful**

| Token | Meaning | Light | Dark |
|---|---|---|---|
| `--comparing` | elements being compared | amber `#f59e0b` | amber |
| `--pointer` | active cursor / mid | blue `#2563eb` | cyan `#06b6d4` |
| `--swap` | values being exchanged | fuchsia `#c026d3` | fuchsia |
| `--found` | target found / sorted | emerald `#10b981` | yellow `#eab308` |
| `--visited` | visited node / cell | indigo `#818cf8` | indigo |
| `--discarded` | eliminated region | slate `#cbd5e1` | slate `#334155` |
| `--error` | invalid / mismatch | rose `#f43f5e` | rose |

Legacy aliases also exist (`--algo-comparing`, `--algo-swapped`, `--algo-sorted`, `--algo-found`, `--algo-discarded`, `--algo-pointer`, `--algo-visited`) and are used by boards.

### 1.4 Typography

| Role | Font | Notes |
|---|---|---|
| Headings / display | **Bricolage Grotesque** | loaded from Google Fonts; `--font-heading` |
| Body / labels | **Plus Jakarta Sans** | loaded |
| Code | **JetBrains Mono** | loaded |
| CSS `h1–h6` rule | **'Space Grotesk'** | **not loaded** — fix during redesign |

Declared scale tokens: `display-lg`, `headline-xl/lg/md/sm`, `body-lg/md/sm`, `label-lg/md`, `code-lg/md/sm` (families only — sizes are applied ad hoc in components).

### 1.5 Spacing & shape
- `space-2xs` 0.25rem, `space-xs` 0.5rem, `space-sm` 0.75rem, `space-md` 1rem, `space-lg` 1.5rem, `space-xl` 2rem, `space-2xl` 3rem, `space-3xl` 4rem.
- Gutters `1 / 1.5 / 2rem`; margins `1 / 2 / 3rem`.
- Radii in use: `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`, plus mockup scales `1rem / 2rem / 3rem`.

### 1.6 Effects
- `.glass-panel`, `.glass-card` (dark glass, blur 12–16 px, white 7–10% borders).
- `.aurora-glow-cyan`, `.aurora-glow-magenta`, `.aurora-glow-gold` radial glows.
- `.dark-matter-zone` for discarded regions.
- Starfield canvas background.
- Custom 5 px scrollbars.
- `prefers-reduced-motion` global override.

---

## 2. Current visual inconsistencies to resolve

1. **Three palettes coexist:** blue/ivory shadcn, purple/cyan Observatory, and raw neon Tailwind (`cyan-400`, `bg-black/40`, `border-white/10`).
2. **Light mode leaks dark chrome:** workspace controls use dark-only utilities regardless of theme.
3. **Body vs app background mismatch:** `body { background-color:#05070f }` with cyan/indigo gradients, while the app uses `bg-background` (#faf8f5 in light).
4. **Heading font bug:** `'Space Grotesk'` not loaded.
5. **Icon-system drift:** Lucide everywhere, Material Symbols loaded but unused.
6. **Type-size drift:** heavy use of 10–11 px labels instead of the declared scale.
7. **Spacing/radius drift:** token classes mixed with raw utilities.
8. **State chrome:** visualizer header changes shape between paused and playing.
9. **Contrast risks:** muted text on tinted surfaces; translucent white borders in light mode.
10. **Accessibility:** icon-only buttons, tiny targets, inconsistent focus rings.

---

## 3. Aurora Learning migration strategy

### Step 1 — Freeze behavior
Do not change the store, algorithm generators, auth context, types, or API calls. Restyle only.

### Step 2 — Add tokens, don't rename yet
Append Aurora tokens in `src/index.css`:

```css
@theme {
  /* Aurora Learning — example names, replace with the official palette */
  --color-aurora-bg: ...;
  --color-aurora-surface: ...;
  --color-aurora-primary: ...;
  --color-aurora-accent: ...;
  --color-aurora-text: ...;
  --color-aurora-muted: ...;
  --color-aurora-border: ...;
}
```

Then map existing semantic names (`--background`, `--surface`, `--on-surface`, `--primary`, etc.) onto Aurora values. This keeps hundreds of existing utility classes working while the visual language changes.

### Step 3 — Replace raw utilities
Search and replace hard-coded neon/dark-only classes with semantic tokens:

| Current | Replace with |
|---|---|
| `bg-[#0b1020]/80` | `bg-surface/90` |
| `text-cyan-400`, `text-cyan-300` | `text-primary` / `text-on-surface-variant` |
| `border-white/10` | `border-outline-variant/40` |
| `bg-black/30`, `bg-black/40` | `bg-surface-container-low` |
| `text-white` (body copy in light mode) | `text-on-surface` |
| `bg-cyan-500 ... text-black` | `bg-primary text-on-primary` |

### Step 4 — Consolidate typography
- Fix the `h1–h6` rule to Bricolage (or Aurora display face).
- Define actual size/line-height tokens for display, headline, body, label, code.
- Replace `text-[10px]` / `text-[11px]` with the label scale.
- Remove Material Symbols from `index.html` if unused.

### Step 5 — Normalize shape & spacing
- Choose one radius scale and apply it to buttons, cards, modals, inputs, boards.
- Replace raw `p-2/p-4` with Aurora spacing tokens where practical.
- Standardize board frame, toolbar, and panel paddings.

### Step 6 — Component-by-component
1. UI primitives (`button`, `input`, `badge`, `card`, `dialog`, `tabs`, `tooltip`, `slider`).
2. Shell (`Navbar`, `CommandPalette`, `ChatDrawer`, auth modals).
3. Visualizer workspace (`InputPanel`, `StatsCard`, `Legend`, `PlaybackControls`, `ExplanationPanel`).
4. Boards (one family at a time).
5. Pages (Home → Topics → Compare → Solver → Contests).

### Step 7 — Verify
- Light and dark parity.
- Contrast AA.
- 360 / 390 / 768 / 1024 / 1440 px.
- Keyboard-only operation.
- Reduced motion.
- No regression in algorithm switching, stepping, deep links, auth gating, chat streaming or contest submission.

---

## 4. Token ownership map

| Area | File | What to change |
|---|---|---|
| Global tokens & utilities | `src/index.css` | Aurora palette, type, radius, glass/glow utilities |
| Fonts & metadata | `index.html` | Google Fonts links, title, favicon |
| Primitive look | `src/components/ui/*` | radii, states, focus rings, density |
| Shell look | `src/components/layout/Navbar.tsx` | height, nav pills, search, profile menu |
| Workspace look | `src/components/visualization/*` | panels, controls, charts, legends |
| Board look | `src/components/boards/*` | board frames + semantic colors |
| Page composition | `src/pages/*` | layout, sections, responsive behavior |
| Motion | `src/components/aceternity/*`, `magicui/*`, `canvas/*` | optional decorative layer |

---

## 5. Reference artifact

`design-reference/stitch_algoviz_learning_observatory/solve_a_problem_algoviz/code.html` is a static HTML/Tailwind mockup of the "Solve a Problem" page using the Observatory palette. Use it for layout intent and token names, **not** as production code. It relies on the Tailwind CDN and Google-hosted imagery.
