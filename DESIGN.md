# RVC Platform — Design System

The single source of truth for how this platform looks, moves, and behaves.
Read before redesigning any section. When this doc and the code disagree,
**the code wins** — update the doc. Pairs with `ARCHITECTURE.md` (stack, routes, data conventions).

---

## 1 · Intent

**Operational Modernism** — Palantir-influenced instrument-panel aesthetics;
mission-critical Swiss, ops-console register. Adjacent references: Bloomberg
Terminal, Linear, Stripe docs.

Two questions govern every decision:

1. How does a *precision instrument* acknowledge attention? (Not "how does a
   marketing card light up.")
2. Is this carrying information, or is it dressing? If dressing, kill it.

**It is not** a SaaS landing page, Apple-style hero theatrics, or a dashboard
with status pills and green-LED system-cosplay.

**Restraint is the design.** The recurring user note across iterations is
*subtler*. Default move when in doubt: reduce — smaller, dimmer, slower.

**Surface split — intentional, not a conflict:**

- **Landing page** (`/`): dark. Full-viewport dark hero; left-aligned headline,
  one subhead, one primary CTA. Nothing else — no kicker, no whisper subtitle,
  no meta strip. The dark register establishes brand authority before the user
  enters the platform.
- **Platform pages** (`/intake`, `/report`, `/modules`, `/ipo`): light
  (`.light-theme` on the page root). High-density operational consoles benefit
  from a light background — readability under office lighting, longer dwell time,
  forms and data tables are easier to scan. The accent color, typography, spacing,
  and interaction vocabulary remain identical; only the surface inverts.

---

## 2 · Brand color

**One accent. Exactly one.** `--accent: #2b62e3` (RVC investor brief). Every blue
resolves to it or a documented alpha variant; hardcoded `rgba(43, 98, 227, …)`
is a code smell — fold it into a variable.

| Token                             | Value                     | Role                       |
| --------------------------------- | ------------------------- | -------------------------- |
| `--accent`                        | `#2b62e3`                 | primary spine              |
| `--accent-deep`                   | `#1a4bc7`                 | pressed                    |
| `--accent-hot`                    | `#5b8aee`                 | hover                      |
| `--accent-soft`                   | `rgba(43, 98, 227, .15)`  | tinted fill                |
| `--accent-glow`                   | `rgba(43, 98, 227, .55)`  | halo (sparing)             |
| `--accent-glow-soft`              | `rgba(43, 98, 227, .18)`  | softer halo                |
| `--accent-border`                 | `rgba(43, 98, 227, .22)`  | tinted hairline            |

**No second hue** — no teal, cyan, purple, green, or cross-hue gradients.
`--danger` (`#ff5e5e`) and `--good` (`#4ade80`) are for genuine state only,
never decoration.

**Dark surface ladder** (landing page, header, mobile nav):

```
--bg #08090c   --bg-elev #0f1219   --bg-elev-2 #151a24
--line #1c2230   --line-soft #131722
--t1 #e8edf5   --t2 #8b95ab   --t3 #5b667d   --t4 #454f63
```

**Light surface overrides** (`.light-theme` — platform pages only):

```
--bg #f5f7fb   --bg-elev #ffffff   --bg-elev-2 #eef1f7
--line #dde2ed   --line-soft #eaecf4
--t1 #0d1526   --t2 #4b5670   --t3 #7a8399   --t4 #a0aab8
```

Accent tokens (`--accent`, `--accent-soft`, `--accent-border`, etc.) are
identical in both surfaces — they never override in `.light-theme`. The accent
spine is always `#2b62e3`.

This platform is **single-monobrand** blue. Don't drift toward two or three
equal accents — commit to one hue or rotate many; "two or three equal accents"
is absent at this tier.

---

## 3 · Typography

| Variable    | Family                              | Used for                    |
| ----------- | ----------------------------------- | --------------------------- |
| `--hero`    | Spectral 400                        | only `.heroHeadline`        |
| `--display` | IBM Plex Sans 400 / 600 / 700       | section titles, headings    |
| `--body`    | IBM Plex Sans 300 / 400 / 500       | paragraphs, leads, body     |
| `--mono`    | IBM Plex Mono 400 / 500 / 600 / 700 | all operational labels      |

CJK falls through to Noto Sans SC via the unicode cascade — don't branch fonts
per language in JSX. No fifth family; don't load extra weights (payload discipline).

**No italic** — engineered tone reads better upright. One exception:
customer-voice pull-quotes (Spectral italic). Don't add a second.

**Earmark recipe — the typographic fingerprint.** Every mono surface gets:

```css
font-variant-numeric: slashed-zero;
font-feature-settings: "tnum" on, "lnum" on, "liga" off, "zero";
```

Tabular figures + slashed zero + ligatures off = data reads like telemetry, not
prose. Apply this to KPI readouts, score values, progress percentages, dates,
and checklist counters.

**Operational chrome is language-invariant** — chapter labels, codes, readout
keys stay English in both locales (`zh` / `en`). Translatable copy goes through
`src/locales/{zh,en}.json`.

**Tracking** — headlines at `letter-spacing: -0.02em`, line-height ~1.15.
Mono labels tracked open at `0.18em–0.28em`.

---

## 4 · Spacing & layout

**18-unit modular rhythm** — every token a clean fraction of 1rem at an 18px root:

```
--space-1 .555rem 10px    --space-2 .888rem 16px
--space-3 1.333rem 24px   --space-4 1.777rem 32px
--space-5 2.666rem 48px   --space-6 3.555rem 64px
--space-7 4.444rem 80px   --space-8 7.111rem 128px
```

Hardcoded `padding: 32px` quietly breaks the rhythm — **search the diff for
`px` before committing**. Component `1px` borders, `2px` radii, font sizes,
and shadow offsets are fine; layout spacing is not.

- **Corners:** `0` / `2px` / `999px` (pills) only. No 8/12/16px rounding.
- **Hairlines:** 1px solid `var(--line)`. No other stroke thicknesses for structural lines.
- **Section rhythm:** every section uses `.section` wrapper. Don't author a bespoke container.
- **Page width:** max 1920px, 48px horizontal padding. Platform console pages may use
  a left sidebar (220px) + main content pattern.
- **One base stylesheet** (`rvc-base.css`). Per-page CSS files scope to their page only.
  No Tailwind, no styled-components, no CSS-in-JS, no inline `style={{}}` beyond
  dynamic custom-property assignment (e.g. `style={{ '--progress': pct }}`).

---

## 5 · Interaction & active-state vocabulary

A deliberately compact set. **No new active-state patterns without updating this section.**

- Avoid: snappy pops, large scale jumps, full-saturation accent borders, diffuse
  glowing shadows, status pills with green LEDs, decorative serial codes.
- Prefer: **shadow over border, motion over color flip, asymmetric timing,
  inner cascade, sub-element recession.**

### 5.1 — Inverse-focus card grid

Applied to module cards, scenario cards, channel cards, and any comparable grid.

**Rest:** `opacity: 0.55`, `filter: saturate(0.65)`, `1px solid var(--line)` (no
accent border, ever), no transform. **Anchor rule:** keep one small high-contrast
token per card (a code label or the title) at `opacity: 1` so the row scans when
nothing is hovered — without it, rest looks broken, not restrained.

**Hover (focused card)** — depth lives entirely in the shadow, **no `border-color` change**:

```css
.card:hover {
  opacity: 1; filter: saturate(1);
  transform: translateY(-3px) scale(1.008);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, .35),
    0 8px 22px -12px rgba(0, 0, 0, .5),
    0 28px 56px -32px rgba(0, 0, 0, .55),
    0 36px 72px -40px rgba(43, 98, 227, .14);
}
```

**Hover (siblings)** drop below rest:

```css
.row:hover .card:not(:hover) { opacity: .32; filter: saturate(.5); }
```

**Inner cascade:** stagger children 0 / 40 / 80ms so the card fills in rather than
flipping wholesale. **Recessed payoff:** the CTA sits at `opacity: .4, translateY(4px)`
at rest and lifts to `1 / 0` on card-hover.

### 5.2 — Directive arrow (answer / action slabs)

Replaces the overused `border-left` pull-quote bar. Two signals: a top-edge accent
hairline fading to transparent by ~55% + a `▸` mono chevron that nudges +3px right on hover.

```css
.fix-slab {
  background-image: linear-gradient(to right, var(--accent), transparent 55%);
  background-size: 100% 1px; background-repeat: no-repeat;
}
.fix-slab::before { content: '▸'; color: var(--accent); font-family: var(--mono); }
.card:hover .fix-slab::before { transform: translateX(3px); }
```

### 5.3 — CTA micro-motion (`.btnPrimary`)

No solid-fill flip. Three axes breathe together over ~350ms: soft `--accent-soft`
background tint inside the existing border (text unchanged), letter-spacing opens
`0.18em → 0.22em`, and the arrow shifts +4px with a 1px trail drawing behind it.
`.btnGhost`: underline draws left-to-right via `background-size`. Motion, not flip.

### 5.4 — Nav active indicator

The active page gets a 4px accent square that materializes with an opening
margin + soft glow — like a status light toggling on. No underline, no border change.

### 5.5 — Progress / timeline rail (intake, IPO)

Step progress uses a 2px accent bar scaling vertically open when a step becomes
current. Active step: `translateZ(48px) scale(1.02)`. No halos — the rail +
3D push carry the signal alone.

**Tune in this order:** rest opacity → sibling-dim → lift → shadow tint alpha →
scale (leave at `1.008`; past `1.015` breaks the tone).

**When NOT to use these:** single hero cards, dense data grids (dimming hurts
scanning), primary CTAs (always full strength), mobile (skip recessed treatment
under `@media (hover: none)`).

---

## 6 · Motion

- **Asymmetric timing** — enter 320ms ease-out, leave 480ms ease. Page-wide.
  Symmetric feels mechanical; the slower fade-back feels like the UI is thinking.
- **No bounce / spring / overshoot.** `cubic-bezier(0.22, 1, 0.36, 1)` where
  ease-out is needed; otherwise plain `ease`.
- **Scale stays under `1.015`** — lift from `translateY`, not size.
- **No carousels, parallax (beyond hero crossfade), Lottie, or scroll theatrics.**
- **Reduced motion** — every animation needs a still fallback under
  `@media (prefers-reduced-motion: reduce)`.

---

## 7 · Anti-patterns — AI-cliché vocabulary

Reads as LLM-dashboard cosplay; do not introduce:

| Pattern                            | Why                                              |
| ---------------------------------- | ------------------------------------------------ |
| `SYS·01` decorative codes          | no information; system-cosplay                   |
| `STABLE` + green-dot pill          | implies monitoring that doesn't exist            |
| `MISSION READY` pill               | sci-fi register, wrong for B2B                   |
| 56px diffuse halo glows            | reads as marketing, not precision                |
| border-color flip on hover         | reads as a control, not depth                    |
| blinking cursor caret              | terminal-cosplay                                 |
| bilingual "whisper" subtitle under hero | density without information                 |
| hero meta strip                    | pitch-deck proof-points; body sections prove these |

The test: does the label carry an actual count, category, or function? If dressing, kill it.

Also: no italic (except customer-voice pull-quotes), no solid blue fills on cards,
no multi-color globe markers, no multi-paragraph comments in CSS/JSX, no emoji.

---

## 8 · Content

- Both `zh` and `en` trees in `src/locales/` mirror key-for-key — missing keys
  render `undefined`. When adding a field, add it to both.
- Operational-chrome strings stay identical across locales (readout keys, code labels,
  chapter markers like `CASE·01`).
- Logo / wordmark stays verbatim — `RVC`, the `◆` diamond mark. Don't stylize or replace.
- **Consistent mock numbers** — search globally before changing any one occurrence:
  `72/100` score, `Top 28%`, `$42B+`, `320+` advisors, `2,486+` enterprises.

---

## 9 · Lessons

- **Listen for "subtle."** The most repeated note; each occurrence drives a
  reduction. Heard twice, audit the whole page — the baseline is too loud, not
  just the cited component.
- **"Glowing border" is the default LLM move, and it's overused.** The inverse-focus
  + 4-stop shadow + directive-arrow vocabulary exists because border-color flip was
  blocked. When stuck on a hover treatment, list conventional options and rule them
  out first.
- **AI-cliché vocabulary is real** — `SYS·01`, `STABLE`+dot, `MISSION READY`,
  56px halos all read as generated to a designer's eye. Apply the dressing test.
- **Save validated approaches, not just corrections** — the user agreeing with a
  non-obvious call is as load-bearing as a correction; it marks a settled judgment.
- **Anchor element rule** — in an inverse-focus row, one token per card stays at
  `opacity: 1` at rest, or the row looks broken.
- **Code wins over docs** — update the doc; don't preserve obsolete advice with
  "older version" markers. Conflicting docs are worse than missing ones.

---

## 10 · Reference: Palantir DNA

Calibration target. Operational Modernism + a Monolith title-card hero.
Warm-charcoal `#1E2124` + paper white (not pure black/white). A 5-stop curated
palette with **one accent per context** — never two on one surface; alarm red
reserved for errors. Display/text type at Regular + Bold only, no light weights.
Every headline tier at `-0.02em`. All-caps 12px earmark labels with slashed-zero
+ tnum/lnum/liga-off — the fingerprint. 18-unit modular spacing, 0–2px corners,
almost no motion.

**Takeaway:** the HUD vocabulary *is* the structure, not decoration over a
marketing page. Borrow Palantir's discipline (earmark recipe + 18-unit grid +
single-accent-per-context). The landing stays dark; the platform pages invert
to light for readability — the discipline holds on both surfaces.
