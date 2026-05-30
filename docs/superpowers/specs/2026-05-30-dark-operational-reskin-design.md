# rvcai_ui — Dark Operational-Modernism Reskin (Design Spec)

**Date:** 2026-05-30
**Status:** Approved (direction + rollout + hero font confirmed)
**Goal:** Re-skin all 5 pages of `rvcai_ui` to RVC-web's *Operational Modernism* design
language — dark instrument-panel surface, single accent, restraint — **without breaking
any functionality**.

Source of the design language: the sibling project `RVC-web` (`docs/design.md`). This
spec ports that system onto rvcai_ui's existing static HTML/CSS/vanilla-JS pages.

---

## 1 · Scope & intent

rvcai_ui is a static prototype: 5 pages (`index`, `intake`, `report`, `modules`, `ipo`),
a shared `rvc-base.css`, page-level inline `<style>`, and page-level inline `<script>`.

**This is a visual reskin only.** We change colours, surfaces, type, corners, shadows,
motion, and styling-only markup classes. We do **not** change page logic, content copy
(Chinese stays), information architecture, routing (`vercel.json`), or `logo.svg`.

The current look is exactly what Operational Modernism rejects: light glass cards,
multi-hue (blue/cyan/green/orange), heavy 20px rounding, gradient-clipped KPI text,
button shine sweeps, blinking status dots, blurred decorative orbs. The reskin replaces
that marketing/AI-cliché vocabulary with the engineered, restrained register.

**Restraint is the design.** When in doubt: smaller, dimmer, slower. One accent, never two.

---

## 2 · Token system (rewrite `rvc-base.css :root`)

**Surfaces (dark ladder, no pure black/white):**
```
--bg #08090c   --bg-elev #0f1219   --bg-elev-2 #151a24
--line #1c2230   --line-soft #131722
--text #e8edf5   --text-soft #8b95ab   --text-mute #5b667d
```

**One accent + documented alphas (replaces the `--blue`/`--cyan` two-hue system):**
```
--blue / --accent      #2b62e3   primary spine (keep --blue name as alias to avoid churn)
--blue-d / --accent-deep #1a4bc7 pressed
--accent-hot           #5b8aee   hover (absorbs the old --cyan role)
--accent-soft   rgba(43,98,227,.15)   tinted fill
--accent-border rgba(43,98,227,.22)   tinted hairline
--accent-glow-soft rgba(43,98,227,.18) soft halo (sparing)
```
- **`--cyan` is removed as a second hue.** All former cyan usages resolve to `--accent`
  or `--accent-hot`. No cross-hue gradients.
- `--ok #4ade80` / `--warn #f59e0b` / `--danger #ff5e5e` survive for **genuine state only**
  (risk tags, validation), never decoration.

**Geometry & depth:**
- `--r: 2px` (was `20px`). Allowed corners: `0`, `2px`, pills `999px` only.
- Replace the soft blue glow `--sh` with a dark contact-shadow set (tight + diffuse,
  near-black, with at most a whisper of accent tint at the floor — never a ring).

**Type:**
```
--font-sans: 'IBM Plex Sans', <CJK fallbacks>   (was Inter)
--font-mono: 'IBM Plex Mono', <fallbacks>        (was JetBrains Mono)
--font-hero: 'Spectral', <CJK fallbacks>         (NEW — hero headline only)
```
Update the Google-Fonts `<link>` on **all 5 pages** to load Plex Sans + Plex Mono +
Spectral and drop Inter + JetBrains Mono.

---

## 3 · Typography rules

- **Spectral** only on the index hero headline (`.hero-h`). Nowhere else.
- **Plex Sans** for headings, section titles, body.
- **Plex Mono** for all operational chrome: KPI values, eyebrows (`.sec-ey`), tags,
  codes, sidebar labels, progress readouts.
- **Earmark recipe** on every mono surface — add a shared selector list to `rvc-base.css`:
  ```css
  font-variant-numeric: slashed-zero;
  font-feature-settings: "tnum" on, "lnum" on, "liga" off, "zero";
  ```
- Headline tracking `-0.02em`, line-height ~1.15. Mono labels tracked open `0.18em–0.28em`.
- **No gradient-clipped text** — `.kpi-val` becomes flat `--text` (or accent), mono earmark.
- **No italic** (rvcai has no pull-quote requirement; keep upright).

---

## 4 · Component mapping (current → reskinned)

| Component | Now | Reskinned |
| --- | --- | --- |
| `header` | glass `backdrop-filter` blur, blue tint | solid dark bar, 1px `--line` hairline, no blur |
| `.logo-box` | blue→cyan gradient, 10px radius, glow | flat dark/accent mark, 2px corner, no gradient/glow (logo.svg unchanged) |
| nav `a.active` | blue pill w/ border | nav-LED: 4px accent square materializes; no border flip |
| `.btn-primary` / `.btn-blue` | gradient fill + shine sweep | outlined; fill on hover only; CTA micro-motion (bg tint inside border, letter-spacing opens, arrow +4px) |
| `.btn-outline` / `.btn-sm` | rounded, blue | sharp (2px), accent hairline, hover bg tint |
| `.card` | white glass, 20px radius, glow overlay, hover border flip | dark `--bg-elev`, 2px, no glow; depth via shadow; **no border-color change on hover** |
| `.card-inner-glow` | radial white glow | removed |
| card rows (`.mod-card`, KPI items, case cards) | uniform | **inverse-focus grid**: rest `opacity .55`/desaturated, hover lifts (shadow, `translateY(-3px)`, scale ≤1.008), siblings dim to `.32`; one anchor token stays lit |
| `.tag` + `.tag-dot` | colored pill + **blinking** dot | flat tag, mono earmark; **dot static** (no blink); state colors only for real state |
| `.bg-mesh` / `.orb` | blurred animated orbs | replace with a low-alpha wireframe grid backdrop (RVC-web `.gridBg`) + subtle vignette; no decorative orbs |
| `.pbar` / `.pfill` | blue→cyan gradient | single-accent fill, no gradient |
| `.sidebar` `.sb-link.active` | blue pill | nav-LED / accent rail treatment |
| `.reveal` → `.vis` | fade-up, cubic-bezier(.22,1,.36,1) | **kept as-is** (already matches RVC-web easing); add reduced-motion fallback |

---

## 5 · Motion

- Asymmetric timing: enter ~320ms ease-out, leave ~480ms ease.
- **Remove**: button `@keyframes shine`, tag `@keyframes blink`, any bounce/overshoot.
- Scale stays under 1.015; lift from `translateY`, not size.
- Keep `.reveal` IntersectionObserver behavior; keep marquee but desaturate.
- Every animation gets a still fallback under `@media (prefers-reduced-motion: reduce)`.

---

## 6 · Per-page treatment

- **index** — hero headline → two-line Spectral; typewriter (`.hero-h`) preserved, restyled.
  AI-engine SVG recolored for dark: inline `fill="#07132B"` text → light; accent strokes;
  remove multi-color. KPI strip → mono earmark readouts (no gradient text). Case-wall
  marquee preserved, desaturated. ~209 hex + ~86 rgba literals to convert.
- **report** — radar chart + score gauge recolored single-accent on dark; roadmap dark;
  sidebar `.rsb-link.active` → nav-LED. ~78 hex + ~56 rgba.
- **modules** — `.mod-card` grid → inverse-focus; `.filter-btn` restyled; detail modal
  (`#overlay`/`#mod-detail`/`#detail-*`) dark; search + `data-category`/`data-filter`
  intact. ~46 hex + ~43 rgba.
- **ipo** — maturity gauge, stage timeline, checklist, risk panel → dark single-accent;
  sidebar `.isb-link.active` → nav-LED. ~36 hex + ~56 rgba.
- **intake** — 7-step flow preserved (`data-step`, `.step-num`, `.step-item`, `.range-opt`,
  `.tag-opt`, `.step-content`, `.chk-item`, `.ai-step-content`, `#prog-fill`, `#prev/next/
  submit-btn`); stepper, sliders, tags, right AI panel restyled dark. ~31 hex + ~20 rgba.

---

## 7 · Preservation contract (do not break functionality)

**Never rename or remove** these JS-referenced hooks — restyle them, keep the names:
- Shared: `#mob-nav`, `#ham`, `.reveal`/`.vis`, `.open`, `.active`.
- index: `.kpi-val[data-count]`, `data-w`/`data-suffix`/`data-count`/`data-prefix`,
  `.kpi-bfill`, `.hero-h`.
- intake: `data-step`, `.step-num`, `.step-item`, `.range-opt`, `.tag-opt`,
  `.step-content`, `.chk-item`, `.ai-step-content`, `#step-title`/`#step-label`/
  `#step-desc`, `#prog-pct`/`#prog-fill`, `#prev-btn`/`#next-btn`/`#submit-btn`.
- report: `.rsb-link`, `.active`.
- modules: `data-category`, `data-filter`, `.mod-card`, `.filter-btn`, `#overlay`,
  `#mod-detail`, `#detail-title`/`-sub`/`-items`/`-kpi1..3`, `.filter-search input`.
- ipo: `.isb-link`, `.active`.

**Other invariants:**
- No edits to any `<script>` logic.
- Content copy unchanged (Chinese strings stay). IA + nav order unchanged.
- `logo.svg`, `vercel.json` routes, `.vercelignore` unchanged.
- Bump `rvc-base.css?v=` cache param on every page per the repo's own convention
  (README §协作开发流程).
- State classes (`.open`/`.vis`/`.active`) may change appearance but **not** name.

---

## 8 · Rollout (reference-page-first)

1. Rewrite `rvc-base.css` tokens + shared components to the dark system (§2–§5).
2. Reskin **`index.html`** fully as the reference page. Verify in-browser: desktop +
   mobile (≤768px), nav active states, mobile nav scroll, typewriter, KPI count-ups,
   SVG animations, marquee, reveal. **Get sign-off.**
3. Roll `report → modules → ipo → intake`, reusing tokens, converting inline literals as
   touched. Verify each page's full interaction set before moving on.
4. Final pass: cross-page nav consistency, reduced-motion, no horizontal overflow,
   both nav states, cache-param bump.

**Verification per page:** open via `python3 -m http.server`, exercise every documented
interaction (DESIGN.md §页面级交互), check desktop + ≤768px.

---

## 9 · Out of scope (YAGNI)

- No React/Vite/component migration (README "future" section) — stays static HTML.
- No real form backend, no data-layer JSON extraction.
- No copy rewrites, no new pages, no routing changes.
- No light-theme toggle / fallback — full replacement.
