# Typography Font-Size Refactor — Design Spec
_Date: 2026-06-01_

## Problem

The codebase contains **98 distinct `font-size` values** spread across 6 CSS files with no shared token system. Sizes are hard-coded as raw pixels or `em` fractions with no semantic meaning, making visual consistency impossible to enforce and any future resizing a manual find-replace across hundreds of declarations.

## Goal

Replace all hard-coded font-size declarations with semantic CSS custom properties defined once in `rvc-base.css`, reducing variance from 98 values to 21 named tokens (7 interface + 5 heading + 9 fluid).

---

## Token Scale

All tokens defined in the existing `:root` block in `src/styles/rvc-base.css`, grouped after the existing font-family variables.

### Interface tier (fixed px)

| Variable | Value | Covers | Primary use |
|---|---|---|---|
| `--text-2xs` | `8px` | 7–9px | Fine print, micro labels |
| `--text-xs` | `10px` | 10–10.5px | Captions, footnotes — highest usage (43×) |
| `--text-sm` | `11px` | 11–11.5px | Navigation, secondary text (28×) |
| `--text-base` | `12px` | 12–12.5px | UI controls, default body (30×) |
| `--text-md` | `13px` | 13–13.5px | Buttons, primary text (30×) |
| `--text-lg` | `14px` | 14–14.5px | Emphasized body |
| `--text-xl` | `16px` | 15–17px | Larger UI, emphasis |

### Heading tier (fixed px)

| Variable | Value | Covers |
|---|---|---|
| `--text-2xl` | `20px` | 18–20px |
| `--text-3xl` | `24px` | 22–26px |
| `--text-4xl` | `32px` | 28–36px |
| `--text-5xl` | `44px` | 40–52px |
| `--text-6xl` | `64px` | 54–74px |

### Fluid display tier (clamp, responsive)

| Variable | Value |
|---|---|
| `--text-fluid-xs` | `clamp(22px, 2.4vw, 32px)` |
| `--text-fluid-sm` | `clamp(26px, 3vw, 42px)` |
| `--text-fluid-sm-alt` | `clamp(26px, 3.2vw, 42px)` |
| `--text-fluid-md` | `clamp(34px, 4.4vw, 56px)` |
| `--text-fluid-md-alt` | `clamp(34px, 4.8vw, 60px)` |
| `--text-fluid-lg` | `clamp(68px, 20vw, 110px)` |
| `--text-fluid-xl` | `clamp(96px, 16vw, 180px)` |
| `--text-fluid-2xl` | `clamp(160px, 12vw, 210px)` |
| `--text-fluid-3xl` | `clamp(190px, 13vw, 240px)` |

---

## Mapping Strategy

Each existing value maps to the nearest token. Maximum rounding delta is ±2px — invisible at screen resolution.

| Existing | Maps to |
|---|---|
| 7px, 8px, 8.5px, 9px, 9.5px | `--text-2xs` |
| 10px, 10.5px | `--text-xs` |
| 11px, 11.5px | `--text-sm` |
| 12px, 12.5px | `--text-base` |
| 13px, 13.5px | `--text-md` |
| 14px, 14.5px | `--text-lg` |
| 15px, 16px, 16.5px, 17px, 17.5px | `--text-xl` |
| 18px, 18.5px, 19px, 20px | `--text-2xl` |
| 22px, 24px, 26px | `--text-3xl` |
| 28px, 30px, 32px, 34px, 36px | `--text-4xl` |
| 40px, 42px, 44px, 46px, 48px, 52px | `--text-5xl` |
| 54px, 58px, 60px, 64px, 66px, 68px, 72px, 74px | `--text-6xl` |
| All 9 clamp() values | fluid tokens above |

### Edge cases — manual review required

These values appear in `font-size:` declarations but are not standard readable text sizes:

- **1–5px** (many occurrences) — likely CSS tricks (invisible spacers, force-layout hacks). Do not auto-map. Review each usage context before replacing.
- **600px, 680px** — clearly non-standard. Investigate before touching.
- **`.em` values** (`.02em`–`.56em`) — unusual for font-size; may be relative sizing inside SVG or high-scale display contexts. Review context individually.
- **`3.3em`** — single use, likely SVG. Manual review.

---

## Implementation Scope

Files to update (in this order):

1. **`src/styles/rvc-base.css`** — add token block to `:root`
2. **`src/styles/index.css`** — highest density (124 declarations, 44% of total)
3. **`src/styles/ipo.css`** — 39 declarations
4. **`src/styles/report.css`** — 35 declarations
5. **`src/styles/rvc-base.css`** — 32 declarations (after tokens are defined)
6. **`src/styles/intake.css`** — 26 declarations
7. **`src/styles/modules.css`** — 23 declarations

No changes needed in `.tsx`/`.jsx` files — all font-size declarations are CSS-only.

## Out of Scope

- Font-weight, line-height, letter-spacing normalization (separate concern)
- Mathematical type scale enforcement (YAGNI — semantic names are sufficient)
- SVG `fontSize` attribute changes in `app/page.jsx` (separate coordinate space)

---

## Success Criteria

- Zero raw pixel font-size declarations remaining in any `.css` file (except edge cases documented above)
- All 21 tokens defined in `rvc-base.css :root`
- No visible rendering change in the UI
- Edge cases (1–5px, 600px, 680px, em values) documented and left for manual follow-up
