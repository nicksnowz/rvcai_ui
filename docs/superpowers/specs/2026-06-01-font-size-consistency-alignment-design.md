# Font Size Consistency Alignment — Design Spec
_Date: 2026-06-01_

## Problem

After the font-size tokenization refactor (98 raw px values → 21 CSS variables), a second-pass audit revealed 6 inconsistencies where the same component role uses different tokens across files. No token values need to change — only which token each class references.

## Goal

8 targeted property swaps across 2 CSS files to make similar-purpose elements use the same token regardless of which page they appear on.

---

## Changes

### 1. Eyebrow / section labels — align to `--text-xs`

**Problem:** `.sec-ey` uses `--text-sm` while every other eyebrow label (`.ipo-ey`, `.rhc-ey`, `.mh-ey`) uses `--text-xs`.

**Fix:**
- `src/styles/rvc-base.css` — `.sec-ey`: `--text-sm` → `--text-xs`

---

### 2. Section card title — align to `--text-xl`

**Problem:** `.sch-title` in `ipo.css` uses `--text-xl`, but the same class in `report.css` uses `--text-lg`.

**Fix:**
- `src/styles/report.css` — `.sch-title`: `--text-lg` → `--text-xl`

---

### 3. Section card subtitle — align to `--text-base`

**Problem:** `.sch-sub` in `ipo.css` uses `--text-base`, but the same class in `report.css` uses `--text-sm`.

**Fix:**
- `src/styles/report.css` — `.sch-sub`: `--text-sm` → `--text-base`

---

### 4. Buttons — align all to `--text-md`

**Problem:** `.btn-ghost`, `.btn-primary`, `.btn-sm` all use `--text-md`. `.btn-blue` and `.btn-outline` use `--text-lg` at base but already downsize to `--text-md` at responsive breakpoints — making `--text-lg` a base-only exception with no persistent effect.

**Fix:**
- `src/styles/rvc-base.css` — `.btn-blue`: `--text-lg` → `--text-md`
- `src/styles/rvc-base.css` — `.btn-outline`: `--text-lg` → `--text-md`

---

### 5. KPI labels — align to `--text-sm`

**Problem:** `.kpi-lbl` in `rvc-base.css` uses `--text-md`. The same label role in `index.css`, `modules.css`, and `ipo.css` uses `--text-sm`.

**Fix:**
- `src/styles/rvc-base.css` — `.kpi-lbl`: `--text-md` → `--text-sm`

---

### 6. Footer text — align to `--text-sm`

**Problem:** `.footer-l` uses `--text-md` and `.footer-r` uses `--text-base` — two different sizes for adjacent footer text with no visual reason to differ.

**Fix:**
- `src/styles/rvc-base.css` — `.footer-l`: `--text-md` → `--text-sm`
- `src/styles/rvc-base.css` — `.footer-r`: `--text-base` → `--text-sm`

---

## Out of Scope

- KPI value numbers (`--text-5xl` vs `--text-3xl` in different files) — intentionally different tiers (page-level vs card-level stat)
- Responsive scaling variations within the same component
- Token value changes — all 21 token definitions remain unchanged

---

## Files Changed

| File | Changes |
|---|---|
| `src/styles/rvc-base.css` | `.sec-ey`, `.btn-blue`, `.btn-outline`, `.kpi-lbl`, `.footer-l`, `.footer-r` — 6 property swaps |
| `src/styles/report.css` | `.sch-title`, `.sch-sub` — 2 property swaps |

---

## Success Criteria

- `.sec-ey` uses `--text-xs` (matches all other eyebrow labels)
- `.sch-title` uses `--text-xl` in both ipo.css and report.css
- `.sch-sub` uses `--text-base` in both ipo.css and report.css
- All `btn-*` base declarations use `--text-md`
- `.kpi-lbl` uses `--text-sm` everywhere
- `.footer-l` and `.footer-r` both use `--text-sm`
- All existing tests pass
