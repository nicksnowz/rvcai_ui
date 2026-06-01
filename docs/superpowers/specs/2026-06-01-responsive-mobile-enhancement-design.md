# Responsive Mobile Enhancement — Design Spec
_Date: 2026-06-01_

## Problem

A live audit at **375px** (iPhone-class) of all five pages found two pages with genuine horizontal-overflow breakage and a set of cross-cutting touch-target / small-phone gaps. Findings were measured in the running app (`document.documentElement.scrollWidth` vs viewport), not inferred from CSS.

| Page | Body overflow @375px | Verdict |
|---|---|---|
| Home `/` | 0px | Clean — marquees clipped by `overflow:hidden` |
| Intake `/intake` | 0px | Clean — 3-col collapses at 1024px, form rows at 768px |
| Modules `/modules` | 0px | Clean — grid 1-col, drawer `width:100%` at 768px |
| **Report `/report`** | **148px** | **Broken** |
| **IPO `/ipo`** | **104px** | **Broken** |

**Root cause of both breaks:** a wide data table (`.opp-table` ~502px / `.ck-table` ~457px) sits in a CSS grid content column whose `1fr` track has an automatic `min-width:auto`. The track expands to the table's min-content, blowing the whole content column (and therefore the page body) past the viewport. The 2-col stat grids (`.score-grid`, `.roadmap`) that looked oversized in the audit were victims of this container blowout, not independently broken — once the container is constrained they fit.

**Secondary (not breakage, but real):**
- 30+ interactive controls below the 44px touch-target minimum: header `.btn-primary` (34px), `.lang-toggle` (35px), `.mob-nav a` (38px), sidebar links `.rsb-link`/`.isb-link`/`.sb-link` (~32–36px).
- No `≤480px` breakpoint anywhere; the tightest stat grids (`.prog-summary` stays 3-col at 375px) get cramped on 320–360px phones.

## Goal

Eliminate the two horizontal-overflow bugs, bring interactive controls up to a 44px touch target on mobile, and add a small-phone (`≤480px`) polish pass — without touching desktop layout or any design tokens.

---

## Changes

### P0 — Eliminate horizontal overflow (the actual bugs)

#### 1. Shared table-scroll utility
Add one utility class so wide data tables scroll horizontally inside their card instead of forcing page overflow.

**Fix:**
- `src/styles/rvc-base.css` — add `.table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;}`

#### 2. Report page — constrain content column + wrap tables
**Fix:**
- `src/styles/report.css` — `.report-content`: add `min-width:0;` (lets the grid child shrink below the table's min-content)
- `app/report/page.jsx` — wrap both `<table className="opp-table">` (lines 298, 331) in `<div className="table-scroll">`

#### 3. IPO page — constrain content column + wrap table
**Fix:**
- `src/styles/ipo.css` — `.ipo-content`: add `min-width:0;`
- `app/ipo/page.jsx` — wrap `<table className="ck-table">` (line 250) in `<div className="table-scroll">`

### P1 — Touch targets ≥ 44px on mobile

#### 4. Header + mobile nav controls
**Fix (in the existing `@media(max-width:768px)` block of `rvc-base.css`):**
- `.btn-primary`, `.lang-toggle` — add `min-height:44px;` (currently 34/35px)
- `.mob-nav a` — `min-height:38px` → `min-height:44px`

#### 5. Inner-page sidebar links
**Fix (in the existing `@media(max-width:768px)` blocks):**
- `src/styles/report.css` — `.rsb-link{min-height:44px;}`
- `src/styles/ipo.css` — `.isb-link{min-height:44px;}`
- `src/styles/rvc-base.css` — `.sb-link{min-height:44px;}` (home sidebar)

### P2 — Small-phone (`≤480px`) polish

#### 6. Collapse the tightest stat grids + trim oversized padding
**Fix (new `@media(max-width:480px)` blocks):**
- `src/styles/ipo.css` — `.prog-summary{grid-template-columns:1fr 1fr;}` (3-col → 2-col); `.ipo-top{padding:20px 16px;}`
- `src/styles/report.css` — `.report-head-card{padding:20px 16px;}`
- `src/styles/modules.css` — `.stats-strip{grid-template-columns:1fr;}` (2-col → 1-col)

---

## Out of Scope

- **Home, Intake, Modules layout** — verified clean at 375px; no layout changes (Modules gets only the P2 stats-strip tweak).
- **Design tokens** — no token values or assignments change. This is layout/overflow only.
- **Typography clamp() on inner pages** — inner-page headings (`--text-3xl` = 24px) are acceptable at 375px; converting them to fluid scales is deferred.
- **Restructuring tables into card/stacked layouts** — horizontal scroll inside the card is the chosen pattern; a full label/value restack is a larger redesign and not needed to fix overflow.
- **Desktop (>900px) behavior** — `min-width:0` additions are no-ops at desktop widths.

---

## Files Changed

| File | Changes |
|---|---|
| `src/styles/rvc-base.css` | `.table-scroll` utility; `.btn-primary`/`.lang-toggle`/`.mob-nav a`/`.sb-link` touch targets |
| `src/styles/report.css` | `.report-content` min-width:0; `.rsb-link` touch target; `@media(max-width:480px)` head-card padding |
| `src/styles/ipo.css` | `.ipo-content` min-width:0; `.isb-link` touch target; `@media(max-width:480px)` prog-summary + top padding |
| `src/styles/modules.css` | `@media(max-width:480px)` stats-strip 1-col |
| `app/report/page.jsx` | Wrap 2 `.opp-table` tables in `.table-scroll` |
| `app/ipo/page.jsx` | Wrap 1 `.ck-table` table in `.table-scroll` |

---

## Success Criteria

- `/report` and `/ipo` report **0px** horizontal body overflow at 375px (measured: `document.documentElement.scrollWidth === 375`).
- Home, Intake, Modules remain at 0px overflow (no regression).
- The two report tables and the ipo checklist table scroll horizontally inside their card; no content is clipped off-page.
- Header buttons, language toggle, mobile-nav pills, and inner-page sidebar links measure ≥44px tall on mobile.
- At 480px and 375px, `.prog-summary`, `.stats-strip`, and head-card padding render without cramping.
- `npx vitest run` — all existing tests pass (3 files, 11 tests).
