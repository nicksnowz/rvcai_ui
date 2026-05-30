# rvcai_ui Dark Operational-Modernism Reskin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin all 5 static pages of rvcai_ui to RVC-web's dark Operational-Modernism design language (single accent, dark instrument-panel surface, earmark typography, restraint) without changing any behavior.

**Architecture:** Reassign the *values* of the existing CSS custom properties in `rvc-base.css` to the dark palette (keeping the variable **names** — `--blue`, `--navy`, `--t1..t4`, `--card`, `--bg`, `--r`, `--sh`, `--cyan`, `--bl/--bm`). Because the inline page CSS references these tokens, most styling flips automatically. Then convert remaining **hardcoded** color literals and recolor inline SVGs page-by-page, index.html first as the reference. No build step; verification is manual browser exercise of each documented interaction.

**Tech Stack:** Static HTML + `rvc-base.css` + page-level inline `<style>`/`<script>`, IBM Plex Sans / IBM Plex Mono / Spectral (Google Fonts), served via `python3 -m http.server`. Deployed on Vercel.

**Spec:** `docs/superpowers/specs/2026-05-30-dark-operational-reskin-design.md`

---

## Ground rules (apply to every task)

**Preservation contract — never rename/remove these JS hooks, only restyle:**
`#mob-nav`, `#ham`, `.reveal`/`.vis`, `.open`, `.active`, `.kpi-val[data-count]`, `data-w/-suffix/-count/-prefix`, `.kpi-bfill`, `.hero-h`, `data-step`, `.step-num`, `.step-item`, `.range-opt`, `.tag-opt`, `.step-content`, `.chk-item`, `.ai-step-content`, `#step-title/-label/-desc`, `#prog-pct/-fill`, `#prev-btn/-next-btn/-submit-btn`, `.rsb-link`, `data-category`, `data-filter`, `.mod-card`, `.filter-btn`, `#overlay`, `#mod-detail`, `#detail-title/-sub/-items/-kpi1..3`, `.filter-search input`, `.isb-link`.

- **Do not edit any `<script>` logic.** Do not change Chinese copy, nav order, routes, `logo.svg`, `vercel.json`.
- Allowed corners: `0`, `2px`, pills `999px`. Allowed shadows: dark contact/diffuse, never a colored ring.
- One accent. No cyan/teal/green/orange except `--ok/--warn/--danger` for *genuine state*.

**Global hardcoded-literal → dark conversion table** (used in every page task):

| Current literal (any case) | Replace with |
| --- | --- |
| `#F4F8FF` (page bg) | `#08090c` |
| `#fff` / `#ffffff` as **surface/card** | `#0f1219` (`var(--card)`) |
| `#fff` / `#ffffff` as **text on accent button** | `var(--accent)` (button becomes outlined — see Task 1) |
| `#07132B` / `#07132b` (navy text/fill) | `#e8edf5` (`var(--text)`) for text; `#e8edf5` for SVG label fills |
| `#0B6FFB` (blue) | `#2b62e3` |
| `#004DD9` / `#004FE0` (blue-d) | `#1a4bc7` |
| `#23B7FF` (cyan, **decorative**) | `#2b62e3` (collapse — no second hue) |
| `#E8F2FF` (blue-s tint) | `rgba(43,98,227,0.15)` |
| `#42526E` (t2) | `#8b95ab` |
| `#6B7890` / `#7180A3` (t3) | `#5b667d` |
| `#9AA6B8` / `#A9B6CA` (t4) | `#454f63` |
| `#16B364` (decorative green) | `#2b62e3`; keep `#4ade80` only for genuine success state |
| `#F04438` (danger) | `#ff5e5e` (keep for genuine risk state) |
| `#F59E0B` (warn) | keep (genuine state only) |

Any `rgba(11,111,251, …)` → `rgba(43,98,227, …)` (same alpha). Any `rgba(35,183,255, …)` (cyan) → `rgba(43,98,227, …)`.

---

## Task 1: Rewrite `rvc-base.css` to the dark token + component system

**Files:**
- Modify: `rvc-base.css` (full rewrite of `:root`, header, nav, buttons, cards, tags, progress, sidebar, KPI, footer, bg-mesh)

- [ ] **Step 1: Replace the `:root` token block**

Replace lines 8–18 (`:root{ … }`) with:

```css
:root{
  --font-sans:'IBM Plex Sans','PingFang SC','Noto Sans SC','Microsoft YaHei',system-ui,-apple-system,sans-serif;
  --font-mono:'IBM Plex Mono','Noto Sans Mono','SF Mono','Roboto Mono',ui-monospace,monospace;
  --font-hero:'Spectral','Noto Sans SC','PingFang SC','Microsoft YaHei',ui-serif,Georgia,serif;

  /* One accent + documented alphas (names kept so inline var() usage flips automatically) */
  --blue:#2b62e3; --accent:#2b62e3;
  --blue-d:#1a4bc7; --accent-deep:#1a4bc7;
  --accent-hot:#5b8aee;
  --blue-s:rgba(43,98,227,0.15);
  --accent-soft:rgba(43,98,227,0.15);
  --accent-border:rgba(43,98,227,0.22);
  --accent-glow-soft:rgba(43,98,227,0.18);
  --cyan:#5b8aee;            /* legacy alias — no second hue, resolves into accent family */

  /* Dark surface ladder (no pure black/white) */
  --bg:#08090c; --bg-elev:#0f1219; --bg-elev-2:#151a24;
  --card:#0f1219;
  --line:#1c2230; --line-soft:#131722;
  --bl:rgba(43,98,227,0.11); --bm:rgba(43,98,227,0.22);

  /* Text (names kept; values inverted to light-on-dark) */
  --navy:#e8edf5;
  --t1:#e8edf5; --t2:#8b95ab; --t3:#5b667d; --t4:#454f63;

  /* Genuine state only */
  --ok:#4ade80; --warn:#f59e0b; --danger:#ff5e5e;

  --r:2px;
  --sh:0 1px 2px rgba(0,0,0,.35),0 18px 40px -24px rgba(0,0,0,.6);
}
```

- [ ] **Step 2: Update `body` and add the earmark recipe**

In the `body{…}` rule (lines 23–30) leave structure intact but ensure `background:var(--bg)` and `color:var(--t1)` (already token-based — flips automatically). Immediately after the reset block, add the shared earmark selector list:

```css
/* Earmark recipe — every mono surface reads like telemetry */
.kpi-val,.sec-ey,.tag,.sb-title,.logo-s,.footer-l,.footer-r,
.btn-sm,.kpi-sub{
  font-variant-numeric:slashed-zero;
  font-feature-settings:"tnum" 1,"lnum" 1,"liga" 0,"zero" 1;
}
```
(Per-page mono classes get appended to this list in their page task.)

- [ ] **Step 3: Convert the background mesh to a wireframe grid**

Replace `.bg-mesh`/`.orb`/`.o1`/`.o2` and their keyframes (lines 38–48) with:

```css
.bg-mesh{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;
  background-image:
    linear-gradient(to right,rgba(43,98,227,0.06) 1px,transparent 1px),
    linear-gradient(to bottom,rgba(43,98,227,0.06) 1px,transparent 1px);
  background-size:56px 56px;
  -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 30%,#000,transparent 75%);
  mask-image:radial-gradient(ellipse 70% 60% at 50% 30%,#000,transparent 75%);}
.orb{display:none;}   /* decorative orbs removed; markup left intact */
```

- [ ] **Step 4: Restyle header, nav, and the nav-LED active state**

Replace the `header{…}` rule (lines 55–61) — remove the blur:

```css
header{position:sticky;top:0;z-index:200;height:76px;
  background:rgba(8,9,12,0.88);
  border-bottom:1px solid var(--line);
  display:flex;align-items:center;}
```

Replace `nav a` / `nav a:hover` / `nav a.active` (lines 80–85) with the nav-LED treatment (no border flip):

```css
nav a{position:relative;font-size:13.5px;font-weight:500;color:var(--t2);
  padding:6px 14px;transition:color .18s;white-space:nowrap;}
nav a:hover{color:var(--text,#e8edf5);}
nav a.active{color:#e8edf5;}
nav a.active::before{content:'';position:absolute;left:4px;top:50%;
  width:4px;height:4px;margin-top:-2px;background:var(--accent);
  box-shadow:0 0 8px var(--accent-glow-soft);}
```
Keep the `:focus-visible` block but change `outline-color` to `var(--accent-border)`.

- [ ] **Step 5: Restyle the logo box (flat, no gradient/glow)**

Replace `.logo-box` + `::after` (lines 65–74):

```css
.logo-box{width:40px;height:40px;border-radius:2px;
  background:var(--bg-elev-2);border:1px solid var(--accent-border);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;color:var(--accent);letter-spacing:-0.5px;}
```
Delete the `.logo-box::after` shine overlay. Update `.logo-n{color:var(--navy)}` stays (var flips); `.logo-s` stays.

- [ ] **Step 6: Restyle buttons (outlined; remove gradients + shine)**

Replace `.btn-primary` and its `::after` (lines 131–144):

```css
.btn-primary{font-size:13.5px;font-weight:600;color:var(--accent);
  padding:8px 20px;border-radius:2px;border:1px solid var(--accent-border);
  background:transparent;position:relative;letter-spacing:.02em;
  transition:background .35s ease,letter-spacing .35s ease,color .35s ease;}
.btn-primary:hover{background:var(--accent-soft);letter-spacing:.06em;color:#e8edf5;}
```

Replace `.btn-blue` + `::after` (lines 161–173):

```css
.btn-blue{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:600;
  color:var(--accent);padding:13px 28px;border-radius:2px;
  border:1px solid var(--accent-border);background:transparent;letter-spacing:.02em;
  transition:background .35s ease,letter-spacing .35s ease,color .35s ease;}
.btn-blue:hover{background:var(--accent-soft);letter-spacing:.06em;color:#e8edf5;}
```

Replace `.btn-outline` (175–182) and `.btn-sm` (184–187):

```css
.btn-outline{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;
  color:var(--t2);padding:13px 26px;border-radius:2px;
  border:1px solid var(--line);background:transparent;
  transition:background .28s ease,color .28s ease,border-color .28s ease;}
.btn-outline:hover{background:var(--bg-elev-2);color:#e8edf5;border-color:var(--accent-border);}
.btn-sm{font-size:13px;font-weight:600;color:var(--accent);padding:7px 16px;border-radius:2px;
  border:1px solid var(--accent-border);background:transparent;transition:background .18s,color .18s;}
.btn-sm:hover{background:var(--accent-soft);color:#e8edf5;}
```
Delete the `@keyframes shine` rule (line 144).

- [ ] **Step 7: Restyle cards (no glow, no border-flip; shadow depth)**

Replace `.card`, `.card:hover`, `.card-inner-glow` (147–158):

```css
.card{background:var(--bg-elev);border:1px solid var(--line);border-radius:2px;
  box-shadow:var(--sh);position:relative;overflow:hidden;
  transition:transform .32s cubic-bezier(.22,1,.36,1),box-shadow .32s;}
.card:hover{transform:translateY(-3px);
  box-shadow:0 1px 2px rgba(0,0,0,.35),0 8px 22px -12px rgba(0,0,0,.5),
    0 28px 56px -32px rgba(0,0,0,.55),0 36px 72px -40px rgba(43,98,227,.14);}
.card-inner-glow{display:none;}   /* glow overlay removed; markup left intact */
```
Note: `.card:hover` no longer changes `border-color`.

- [ ] **Step 8: Restyle tags (kill the blinking dot)**

Replace `.tag*` block (189–198):

```css
.tag{display:inline-flex;align-items:center;gap:4px;font-family:var(--font-mono);
  font-size:10px;font-weight:600;padding:4px 10px;border-radius:2px;letter-spacing:.08em;}
.tag-blue{background:var(--accent-soft);color:var(--accent-hot);}
.tag-green{background:rgba(74,222,128,0.10);color:var(--ok);}
.tag-orange{background:rgba(245,158,11,0.10);color:var(--warn);}
.tag-red{background:rgba(255,94,94,0.10);color:var(--danger);}
.tag-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}
```
Delete `@keyframes blink` (line 198).

- [ ] **Step 9: Restyle section headers, icons, progress, sidebar, KPI, footer**

```css
.sec-ey{font-family:var(--font-mono);font-size:11px;font-weight:600;letter-spacing:.18em;
  text-transform:uppercase;color:var(--accent-hot);margin-bottom:7px;}
.sec-ttl{font-size:28px;font-weight:600;color:var(--navy);letter-spacing:-.02em;line-height:1.18;}
.sec-sub{font-size:15px;color:var(--t2);margin-top:8px;line-height:1.65;}

.ico{width:48px;height:48px;border-radius:2px;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;background:var(--bg-elev-2);border:1px solid var(--line);transition:all .22s;}
.ico svg{width:22px;height:22px;stroke:var(--accent);fill:none;stroke-width:1.9;transition:stroke .22s;}
.card:hover .ico{background:var(--accent-soft);border-color:var(--accent-border);}
.card:hover .ico svg{stroke:var(--accent-hot);}

.pbar{height:5px;background:var(--line);border-radius:999px;overflow:hidden;}
.pfill{height:100%;background:var(--accent);border-radius:999px;
  transition:width 1.4s cubic-bezier(.22,1,.36,1);}

.sidebar{position:sticky;top:92px;background:var(--bg-elev);border:1px solid var(--line);
  border-radius:2px;padding:20px 14px;box-shadow:var(--sh);}
.sb-title{font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:.18em;
  text-transform:uppercase;color:var(--t3);padding:0 8px;margin-bottom:8px;}
.sb-link{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:2px;
  font-size:13px;font-weight:500;color:var(--t2);transition:color .18s,background .18s;
  border:none;background:none;width:100%;text-align:left;position:relative;}
.sb-link:hover{color:#e8edf5;background:var(--bg-elev-2);}
.sb-link.active{color:#e8edf5;background:var(--bg-elev-2);font-weight:600;}
.sb-link.active::before{content:'';position:absolute;left:0;top:50%;width:2px;height:60%;
  transform:translateY(-50%);background:var(--accent);}

.kpi-val{font-family:var(--font-mono);font-size:44px;font-weight:600;letter-spacing:-.04em;
  line-height:1;color:var(--text,#e8edf5);background:none;-webkit-text-fill-color:currentColor;}
.kpi-lbl{font-size:13px;color:var(--t2);font-weight:500;margin-top:5px;}
.kpi-sub{font-size:11px;color:var(--t4);margin-top:2px;}

.footer{padding:28px 0;border-top:1px solid var(--line);display:flex;align-items:center;
  justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-l{font-size:13px;font-weight:500;color:var(--t3);}
.footer-r{font-size:12px;color:var(--t4);}
```
(`.kpi-val` no longer uses gradient text-clip — flat light value.)

- [ ] **Step 10: Restyle mobile nav (remove glass, dark surface)**

In `.mob-nav` (108–124) and the `@media(max-width:768px)` `.mob-nav` block (278–321): change `background` to `rgba(8,9,12,0.92)`, remove `backdrop-filter`/`-webkit-backdrop-filter`, set borders to `var(--line)`, link `color:var(--t2)`, and `.mob-nav a.active` to `color:#e8edf5;border-color:var(--accent-border);background:var(--bg-elev-2);box-shadow:none;`. Keep all class names and the horizontal-scroll layout.

- [ ] **Step 11: Add a reduced-motion guard at the end of the file**

```css
@media (prefers-reduced-motion: reduce){
  .reveal{opacity:1 !important;transform:none !important;}
  *{animation-duration:.001ms !important;transition-duration:.001ms !important;}
}
```

- [ ] **Step 12: Commit**

```bash
cd /Users/mac/code/RVC/rvcai_ui
git add rvc-base.css
git commit -m "Reskin shared base to dark Operational Modernism tokens + components"
```

---

## Task 2: Switch font links on all 5 pages

**Files:** Modify `<head>` of `index.html`, `intake.html`, `report.html`, `modules.html`, `ipo.html`

- [ ] **Step 1: Replace the Google-Fonts `<link>` on every page**

Find on each page:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
Replace with:
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Spectral:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Bump the base-css cache param on every page**

Change `rvc-base.css?v=20260527-2` → `rvc-base.css?v=20260530-1` on all 5 pages.

- [ ] **Step 3: Commit**

```bash
git add index.html intake.html report.html modules.html ipo.html
git commit -m "Load IBM Plex Sans/Mono + Spectral; bump base-css cache param"
```

---

## Task 3: Reskin `index.html` (reference page) — SIGN-OFF GATE

**Files:** Modify `index.html` (its `<style>` block, inline `style=` attrs, and inline SVG fills)

- [ ] **Step 1: Read the page's `<style>` block and inline SVGs**

Read `index.html` fully. Catalog every hardcoded literal in the `<style>` block, the 9 inline `style=` attrs, and SVG attributes (`fill="…"`, `stroke="…"`, `font-family="Inter…"`).

- [ ] **Step 2: Apply the global conversion table to the `<style>` block**

For every literal in the page `<style>`, apply the conversion table in *Ground rules*. Specifically: page/section backgrounds → `var(--bg)`/`var(--bg-elev)`; text → `var(--t1/--t2/--t3)`; any blue/cyan → `var(--accent)`; remove any `linear-gradient(... #0B6FFB ... #23B7FF ...)` fills, replacing with flat `var(--accent)` or `var(--bg-elev)`.

- [ ] **Step 3: Hero headline → Spectral**

Set the hero headline rule (`.hero-h`) to `font-family:var(--font-hero);font-weight:400;letter-spacing:-.02em;line-height:1.15;color:var(--text,#e8edf5);`. Do **not** touch the `.hero-h` element id/class or the typewriter `<script>`.

- [ ] **Step 4: Recolor the AI-engine inline SVG**

In the engine SVG: change `<text fill="#07132B">` → `fill="#e8edf5"`, `<text fill="#7180A3">`/`#A9B6CA` → `fill="#5b667d"`, `font-family="Inter,sans-serif"` → `font-family="'IBM Plex Sans',sans-serif"` (and any mono number text → `'IBM Plex Mono'`). Recolor scan/flow strokes and node fills to `#2b62e3` / `#5b8aee`; remove any cyan `#23B7FF`. Keep all SVG `<animate>`/SMIL elements and ids intact.

- [ ] **Step 5: Append index mono classes to the earmark list**

In `rvc-base.css` Step-2 earmark selector, append index-specific mono classes used for readouts/eyebrows if any (e.g. `.hero-trust`, `.kpi-bval`). Re-commit base if changed.

- [ ] **Step 6: Convert KPI strip + case-wall marquee**

Ensure `.kpi-val` uses the flat dark style (inherits from base). Desaturate the case-wall marquee cards (dark `var(--bg-elev)`, `var(--line)` borders); keep the marquee `@keyframes`/animation and DOM intact.

- [ ] **Step 7: Verify in browser**

```bash
cd /Users/mac/code/RVC/rvcai_ui && python3 -m http.server 3000
```
Open `http://localhost:3000/` and confirm:
- Hero typewriter (`.hero-h`) still types; headline is Spectral on dark.
- KPI count-ups animate (`data-count`) and read as mono telemetry; `.kpi-bfill` bars fill.
- AI-engine SVG animates, recolored single-accent on dark (no cyan, no light text-on-light).
- Case-wall marquee scrolls, desaturated.
- `.reveal` sections fade in on scroll.
- Nav `a.active` shows the accent LED; hamburger toggles `#mob-nav` (`.open`).
- Desktop **and** ≤768px: no horizontal overflow, no overlap.

- [ ] **Step 8: Commit, then request sign-off**

```bash
git add index.html rvc-base.css
git commit -m "Reskin index.html to dark Operational Modernism (reference page)"
```
**STOP and ask the user to review index.html before continuing to the other 4 pages.**

---

## Task 4: Reskin `report.html`

**Files:** Modify `report.html` (`<style>`, 67 inline `style=` attrs, radar/gauge SVG)

- [ ] **Step 1: Read `report.html` fully**; catalog literals, inline styles, the radar-chart and score-gauge SVGs.
- [ ] **Step 2: Apply the conversion table** to the `<style>` block and all 67 inline `style=` attrs (these carry many `#…`/`rgba(11,111,251,…)` values — convert each per the table).
- [ ] **Step 3: Recolor radar chart + score gauge** to single accent on dark: grid/web strokes → `var(--line)`; data polygon fill/stroke → `var(--accent)` at low alpha / `var(--accent)`; axis labels → `var(--t2)`. Remove any multi-color series. Keep SVG ids/animations and the `.rsb-link` sidebar markup intact.
- [ ] **Step 4: Sidebar active** — `.rsb-link.active` inherits the base accent-rail treatment; confirm the JS `classList.add/remove('active')` still toggles it (no markup change).
- [ ] **Step 5: Append report mono classes** (score value, roadmap codes) to the earmark list in `rvc-base.css` if present.
- [ ] **Step 6: Verify** — open `http://localhost:3000/report.html`: radar + gauge render dark single-accent; sidebar `.rsb-link` active state toggles on click; `.reveal` works; mobile nav + ≤768px clean.
- [ ] **Step 7: Commit**

```bash
git add report.html rvc-base.css
git commit -m "Reskin report.html to dark Operational Modernism"
```

---

## Task 5: Reskin `modules.html`

**Files:** Modify `modules.html` (`<style>`, 45 inline `style=` attrs, detail modal)

- [ ] **Step 1: Read `modules.html` fully**; catalog literals, the `.mod-card` grid, `.filter-btn` set, and `#overlay`/`#mod-detail` modal styles.
- [ ] **Step 2: Apply the conversion table** to `<style>` + inline styles.
- [ ] **Step 3: `.mod-card` → inverse-focus grid.** Add to the page `<style>`:

```css
.mod-card{opacity:.55;filter:saturate(.65);transition:opacity .48s ease,filter .48s ease,
  transform .48s ease,box-shadow .48s ease;}
.mod-card:hover{opacity:1;filter:saturate(1);transform:translateY(-3px);
  box-shadow:0 1px 2px rgba(0,0,0,.35),0 8px 22px -12px rgba(0,0,0,.5),
    0 28px 56px -32px rgba(0,0,0,.55),0 36px 72px -40px rgba(43,98,227,.14);}
.mod-grid:hover .mod-card:not(:hover){opacity:.32;filter:saturate(.5);}
```
(Use the actual grid wrapper class if not `.mod-grid`; keep one anchor token — the module code/title — at `opacity:1` at rest so the row scans.) **Do not** add `border-color` change on hover. **Do not** rename `.mod-card`, `.filter-btn`, `data-category`, `data-filter`.

- [ ] **Step 4: Restyle `.filter-btn`** (active = accent text + `var(--bg-elev-2)`, no gradient) and the detail modal `#overlay`/`#mod-detail` (dark `var(--bg-elev)`, 2px, hairline; `#detail-*` text tokens).
- [ ] **Step 5: Verify** — open `http://localhost:3000/modules.html`: category filter buttons filter `.mod-card`s; search box filters by text; clicking a card opens `#mod-detail` with populated `#detail-*`; overlay closes; inverse-focus dimming feels right; mobile + ≤768px clean.
- [ ] **Step 6: Commit**

```bash
git add modules.html
git commit -m "Reskin modules.html to dark Operational Modernism (inverse-focus cards)"
```

---

## Task 6: Reskin `ipo.html`

**Files:** Modify `ipo.html` (`<style>`, 34 inline `style=` attrs, gauge/timeline/checklist/risk)

- [ ] **Step 1: Read `ipo.html` fully**; catalog literals, maturity gauge, stage timeline, checklist, risk panel, `.isb-link` sidebar.
- [ ] **Step 2: Apply the conversion table** to `<style>` + inline styles (ipo has 56 rgba literals — convert each).
- [ ] **Step 3: Recolor** maturity gauge + timeline to single accent on dark; checklist states use `--ok/--warn/--danger` only for genuine status; risk panel uses `--danger` for real risk, neutral otherwise.
- [ ] **Step 4: Sidebar** `.isb-link.active` inherits base accent-rail; confirm `classList.add/remove('active')` still toggles.
- [ ] **Step 5: Verify** — open `http://localhost:3000/ipo.html`: gauge/timeline/checklist/risk render dark single-accent; sidebar `.isb-link` toggles; `.reveal` works; mobile + ≤768px clean.
- [ ] **Step 6: Commit**

```bash
git add ipo.html
git commit -m "Reskin ipo.html to dark Operational Modernism"
```

---

## Task 7: Reskin `intake.html`

**Files:** Modify `intake.html` (`<style>`, 25 inline `style=` attrs, stepper + AI panel)

- [ ] **Step 1: Read `intake.html` fully**; catalog literals and the step components (`.step-item`, `.step-num`, `.range-opt`, `.tag-opt`, `.chk-item`, `.ai-step-content`, `#prog-fill`).
- [ ] **Step 2: Apply the conversion table** to `<style>` + inline styles.
- [ ] **Step 3: Restyle the 7-step stepper** (active step `.step-item` → accent indicator, completed → muted accent), sliders/`.range-opt`/`.tag-opt`/`.chk-item` selection states (selected = `var(--accent-soft)` + accent text, no gradient), progress `#prog-fill` → `var(--accent)`, and the right AI panel to dark. **Do not** rename any `data-step`/step hooks or `#prev/next/submit-btn`.
- [ ] **Step 4: Verify** — open `http://localhost:3000/intake.html`: stepping forward/back via `#next-btn`/`#prev-btn` updates `#step-title/-label/-desc`, `#prog-pct`/`#prog-fill`, and `.ai-step-content`; sliders/tags/checkboxes toggle selected styling; submit shows the demo completion state; mobile + ≤768px clean.
- [ ] **Step 5: Commit**

```bash
git add intake.html
git commit -m "Reskin intake.html to dark Operational Modernism"
```

---

## Task 8: Final cross-page pass

**Files:** any page needing touch-ups; `rvc-base.css`

- [ ] **Step 1: Cross-page consistency** — open all 5 pages and confirm header, nav LED, buttons, cards, tags look identical across pages; nav active state matches the current page on each.
- [ ] **Step 2: Literal sweep** — grep each page for stragglers and convert any survivors:

```bash
cd /Users/mac/code/RVC/rvcai_ui
grep -nE "#0B6FFB|#23B7FF|#07132B|#F4F8FF|#004DD9|#004FE0|rgba\(11,111,251|rgba\(35,183,255" index.html intake.html report.html modules.html ipo.html
```
Expected: no matches (or only intentional state colors). Convert any found.

- [ ] **Step 3: Reduced-motion + overflow** — toggle OS reduced-motion and confirm reveals show statically; at 360px width confirm no horizontal scroll on any page.
- [ ] **Step 4: Commit any touch-ups**

```bash
git add -A
git commit -m "Final cross-page consistency + literal sweep for dark reskin"
```

---

## Done criteria

- All 5 pages render in dark Operational Modernism: one accent, 0/2px corners, mono earmark, no gradients/shine/blinking-dots/glass/orbs.
- Every documented interaction (DESIGN.md §页面级交互) still works.
- No JS hook renamed; no `<script>` logic changed; Chinese copy, routes, and `logo.svg` unchanged.
- No horizontal overflow at ≤768px; reduced-motion respected.
