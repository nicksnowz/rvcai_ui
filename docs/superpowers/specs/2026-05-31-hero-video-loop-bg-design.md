# rvcai_ui — Hero Video-Loop Backdrop (Design Spec)

**Date:** 2026-05-31
**Status:** Approved (integration + fidelity + engine-card relocation confirmed)
**Goal:** Port RVC-web's crossfading 5-clip hero video loop into `rvcai_ui` as a
dimmed full-bleed backdrop behind a now single-column hero, and relocate the
AI-engine SVG card to its own block directly below the hero — **without breaking any
existing hero functionality**.

Source of the effect: the sibling project `RVC-web`
(`src/LandingPage.jsx` "Monolith Title-Card", `src/LandingPage.module.css`
`.titleCard*`). This spec adapts that dual-layer crossfade onto rvcai_ui's
React + Vite + react-router + i18n stack.

---

## 1 · Scope & intent

rvcai_ui is now a React/Vite SPA (migrated from the static prototype). The landing
page lives in `src/pages/Index.jsx` with styles in `src/styles/index.css`. Its hero is
a two-column grid: left = eyebrow + typewriter headline (`.hero-h`) + paragraph + two
CTAs + trust row; right = an animated AI-engine SVG card (`.engine-wrap`/`.engine-card`).

**This change does two things:**

1. **Add a video-loop backdrop** to the hero — a faithful port of RVC-web's dual-layer
   A/B crossfade cycling all 5 clips, rendered full-bleed *behind* the hero content,
   dimmed, with a legibility scrim/vignette.
2. **Relocate the engine card** out of the hero's right column into its own standalone
   block stacked **directly below** the hero section. The hero becomes single-column
   (text lockup over footage). The engine card is kept intact and functional; its final
   treatment is deferred ("decide later").

**Restraint stays the design** (per the dark Operational-Modernism reskin already in
place): the video is a dimmed instrument backdrop, not a marketing spectacle.

---

## 2 · Current state (facts the implementer needs)

- `src/pages/Index.jsx` — `<section className="hero"><div className="wrap"><div className="hero-grid">`
  contains: `<div>` (left: lines ~156–172) and `<div className="engine-wrap">` (right:
  the full `<svg viewBox="0 0 670 520">` engine viz, lines ~173–385). The engine SVG holds
  ids `n1`,`n2`,`n3`,`n4`,`svgScore` and classes `svg-*`.
- Index.jsx effects (must stay untouched): scroll-reveal observer (`.reveal`→`.vis`),
  KPI counter observer (`.kpi-val[data-count]` + `.kpi-bfill`), typewriter on `heroRef`
  (`.hero-h`), and an SVG-engine counter effect that listens on `document` for a
  `rvc:wordstart` CustomEvent (dispatched by the typewriter) and updates `n1..n4`/`svgScore`
  via `document.getElementById`. **Because the engine counters resolve by id at the document
  level, the SVG works correctly no matter where it sits in the DOM** — relocation is safe.
- `src/styles/index.css` — `.hero{padding:80px 0 64px}`; `.hero-grid{display:grid;
  grid-template-columns:1fr 1.05fr;gap:64px;align-items:center}`; `.engine-wrap`,
  `.engine-card` and `.engine-card svg *` rules (lines ~30–71). Mobile block (≤768px,
  lines ~180–194) currently sets `.hero-grid{grid-template-columns:minmax(0,1fr)}` and
  `.engine-wrap{order:0;width:calc(100vw - 40px);overflow:hidden}` — these need updating
  once the card leaves the grid (see §5).
- `public/` holds only `logo.svg`, `icons.svg`. Vite serves `public/` at site root.
- `.gitignore`/`.vercelignore` ignore `demo-video/`, `image*`, `*.docx`, `*.pdf`. The
  clip names (`workflow.mp4`…) and `hero-poster.jpg` do **not** match `image*`, so they
  commit and deploy normally.
- CSS is imported via Vite (`import '../styles/index.css'`), so cache-busting is automatic
  — no `?v=` query bump (that was the old static-site convention).
- Working tree on branch `causally-dev` has unrelated uncommitted changes
  (Intake/Ipo/Modules/Report.jsx, zh.json, rvc-base.css, package-lock.json). This work must
  **not** touch or commit those — it lands on an isolated branch/worktree off current HEAD.

---

## 3 · Component: `src/components/HeroVideoLoop.jsx` (new)

A self-contained component encapsulating the crossfade. Index.jsx renders it as the first
child of `.hero`; it owns all video state so Index.jsx's existing effects stay isolated.

**Ported behavior (from RVC-web `LandingPage.jsx`):**
- `const VIDEO_SEQUENCE = ['/workflow.mp4','/data-center.mp4','/meeting.mp4','/ship.mp4','/stock-market.mp4']`
- `const CROSSFADE_MS = 300`
- Two `<video>` layers (A/B) via `useRef`; state `videoLayerAIdx` (0), `videoLayerBIdx`
  (`Math.min(1, last)`), `activeVideoLayer` ('A').
- Effects: reload layer on its idx change (`videoRefX.current?.load()`); kick off
  `videoRefA.current?.play().catch(()=>{})` on mount.
- `advanceVideo(fromLayer)` — on `onEnded`/`onError`: guard `fromLayer === activeVideoLayer`;
  flip active layer; play the next layer from `currentTime=0`; after `CROSSFADE_MS + 60`,
  advance the just-hidden layer's idx to `(idx+1) % length`. Identical to source.
- Each `<video>`: `muted playsInline preload="auto" poster="/hero-poster.jpg" aria-hidden`,
  `onEnded`/`onError` → `advanceVideo`. Active layer gets the visible class, inactive gets
  the hidden class (opacity 0).
- Renders the two `<video>` elements **and** the scrim/vignette `<div aria-hidden>` so the
  whole backdrop is one cohesive unit.

Component takes no required props (sequence/timing are module consts). It renders only the
backdrop layers — never any hero text.

---

## 4 · Index.jsx changes

- Inside `<section className="hero">`, render `<HeroVideoLoop />` as the **first child**
  (before `<div className="wrap">`).
- `.hero-grid` collapses to a single column containing only the existing left `<div>`
  (eyebrow, `.hero-h`, `.hero-p`, `.hero-btns`, `.hero-trust`). The grid wrapper may stay
  (restyled to one column) or be dropped — implementer's choice, but the left content block
  and all its classes/refs stay identical.
- Move the entire `<div className="engine-wrap">…</div>` block out of the hero into a **new
  sibling section directly after `</section>`** of the hero and before `<section className="process">`:
  ```jsx
  <section className="engine-section">
    <div className="wrap">
      <div className="engine-wrap"> …unchanged SVG… </div>
    </div>
  </section>
  ```
  Markup of the engine SVG (ids, `svg-*` classes, animations) is **unchanged**. Keep
  `.engine-wrap`/`.engine-card` class names so existing CSS applies.
- No changes to any of the four `useEffect` hooks. No changes to i18n keys, CTAs, or content.

---

## 5 · index.css changes

**Hero as a positioned, single-column stage over video:**
- `.hero` → add `position:relative; overflow:hidden;` and a modest `min-height` (e.g.
  `clamp(440px, 64vh, 620px)`) so the backdrop reads with presence now that the tall engine
  card no longer sets the height. Keep existing padding.
- `.hero-grid` → single column (`grid-template-columns:minmax(0,1fr)` or remove the grid).
  Content stays left-aligned, constrained to a readable max-width (e.g. `max-width:680px`).
- Content wrapper (`.wrap` inside `.hero`) → `position:relative; z-index:2;` so text/CTAs
  sit above the backdrop.

**Backdrop layers (scoped so they only affect the hero):**
- `.hero-video` (each `<video>`) → `position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; z-index:0; pointer-events:none; opacity:0.26; transition:opacity .3s ease;`
- `.hero-video--hidden` → `opacity:0;`
- `.hero-video-scrim` → `position:absolute; inset:0; z-index:1; pointer-events:none;`
  with a vignette in `--bg` (#08090c): a radial darkening toward the edges plus a vertical
  gradient (slightly darker top and bottom) so the headline, paragraph, and CTAs stay legible
  over moving footage. (Adapt RVC-web's `.titleCardVignette` values; single-column so no
  strong left bias needed, but a mild left-to-right darkening is fine.)

**Engine section (relocated, minimal/neutral — final treatment deferred):**
- `.engine-section` → `padding:48px 0;` (a calm standalone block). Center the card in `.wrap`,
  constrain width (e.g. `.engine-section .engine-wrap{max-width:760px;margin:0 auto;}`).
  Keep `.engine-wrap`/`.engine-card` rules as-is.

**Reduced motion:**
- `@media (prefers-reduced-motion: reduce)` → `.hero-video{display:none;}` and set `.hero`
  to a **dimmed static poster** background (e.g. `background:linear-gradient(rgba(8,9,12,.74),
  rgba(8,9,12,.74)), url('/hero-poster.jpg') center/cover var(--bg);`) so reduced-motion users
  still get a still image rather than flat black. Mirrors RVC-web's still fallback.

**Mobile (≤768px block, update the existing rules):**
- Remove/replace the old `.engine-wrap{order:0;width:calc(100vw - 40px)}` grid rule (the card
  is no longer in the hero grid). Ensure `.engine-section .engine-wrap` is full-width within
  `.wrap` and the SVG scales (`.engine-card svg{width:100%!important;height:auto!important}`
  already handles this — keep it, re-scoped under `.engine-section` if needed).
- Hero stays single-column (already the case). Confirm the video backdrop + scrim still cover
  the (possibly taller) mobile hero via `inset:0`. Video plays on mobile too (faithful to
  RVC-web; reduced-motion is the only opt-out).

---

## 6 · Assets

Copy from `RVC-web/public/` → `rvcai_ui/public/` (duplicate, do **not** remove from RVC-web):
`workflow.mp4`, `data-center.mp4`, `meeting.mp4`, `ship.mp4`, `stock-market.mp4`,
`hero-poster.jpg` (~9.2MB of video + 80KB poster). Served at `/workflow.mp4` etc. by Vite.
These commit and deploy (not matched by ignore patterns). ~9.2MB added is accepted for full
fidelity.

---

## 7 · Preservation contract (do not break functionality)

**Untouched, verified to still work:**
- `.hero-h` typewriter (`heroRef`) and its `rvc:wordstart` dispatch.
- SVG-engine counters `n1`,`n2`,`n3`,`n4`,`svgScore` (resolve by id at document level → work
  after relocation).
- `.kpi-val[data-count]` + `.kpi-bfill` KPI counters; `.reveal`→`.vis` reveal observer.
- Both CTAs (`<Link to="/intake">`, `<Link to="/report">`), trust row, marquee, footer.
- i18n keys, content copy (Chinese stays), nav/IA order.
- State class names unchanged.

**Invariants:**
- No edits to any of Index.jsx's `useEffect` logic.
- Engine SVG markup (ids, classes, SMIL animations) byte-stable through the move.
- Do not touch the unrelated uncommitted changes in the working tree; commit only the files
  this feature adds/edits.

---

## 8 · Testing & isolation

- Light vitest + Testing-Library render test for `HeroVideoLoop` (`src/components/
  HeroVideoLoop.test.jsx`): asserts it renders two `<video>` elements, the initial `src`s
  match `VIDEO_SEQUENCE[0]` and `[1]`, and each carries `muted`/`playsInline`/`poster`.
  Honest scope — jsdom does not play video, so timing/crossfade is not asserted.
- Optional: a render smoke check that `Index` still mounts and the engine SVG (`#n1`) is
  present after relocation.
- Run `npm test` (vitest) and `npm run build` (Vite) before completion.
- Work lands on an isolated branch/worktree off current `causally-dev` HEAD so the unrelated
  uncommitted changes are undisturbed.

---

## 9 · Out of scope (YAGNI)

- No change to the engine card's *final* placement/treatment (deferred — "decide later").
- No new copy, no new hero slogan, no extra title-card section.
- No video transcoding/compression, no lazy-loading framework, no poster regeneration.
- No changes to other pages (report/modules/ipo/intake) or to rvc-base.css.
- No mobile-only "poster instead of video" toggle (faithful: video plays on mobile).
