# Font Size Consistency Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align 8 font-size token assignments so the same component role uses the same token regardless of which CSS file it lives in.

**Architecture:** 8 single-line property swaps across 2 files — no token definitions change, no new tokens added. rvc-base.css gets 6 fixes (eyebrow, buttons, kpi-lbl, footer); report.css gets 2 fixes (sch-title, sch-sub).

**Tech Stack:** CSS custom properties. Vitest for regression verification.

---

## File Map

| File | Changes |
|---|---|
| `src/styles/rvc-base.css` | `.sec-ey` (L226), `.btn-blue` (L199), `.btn-outline` (L205), `.kpi-lbl` (L269), `.footer-l` (L277), `.footer-r` (L278) |
| `src/styles/report.css` | `.sch-title` (L67), `.sch-sub` (L68) |

---

## Task 1: Align rvc-base.css — eyebrow, buttons, kpi-lbl, footer

**Files:**
- Modify: `src/styles/rvc-base.css:199,205,226,269,277,278`

- [ ] **Step 1: Verify current state**

  ```bash
  grep -n "font-size: var(--text-" src/styles/rvc-base.css | grep -E "sec-ey|btn-blue|btn-outline|kpi-lbl|footer-l|footer-r"
  ```
  Expected output:
  ```
  199:.btn-blue{...font-size: var(--text-lg);...
  205:.btn-outline{...font-size: var(--text-lg);...
  226:.sec-ey{...font-size: var(--text-sm);...
  269:.kpi-lbl{font-size: var(--text-md);...
  277:.footer-l{font-size: var(--text-md);...
  278:.footer-r{font-size: var(--text-base);...
  ```

- [ ] **Step 2: Apply the 6 changes**

  **Line 199** — `.btn-blue`: change `--text-lg` → `--text-md`

  Find:
  ```css
  .btn-blue{display:inline-flex;align-items:center;gap:7px;font-size: var(--text-lg);font-weight:600;
  ```
  Replace with:
  ```css
  .btn-blue{display:inline-flex;align-items:center;gap:7px;font-size: var(--text-md);font-weight:600;
  ```

  **Line 205** — `.btn-outline`: change `--text-lg` → `--text-md`

  Find:
  ```css
  .btn-outline{display:inline-flex;align-items:center;gap:7px;font-size: var(--text-lg);font-weight:500;
  ```
  Replace with:
  ```css
  .btn-outline{display:inline-flex;align-items:center;gap:7px;font-size: var(--text-md);font-weight:500;
  ```

  **Line 226** — `.sec-ey`: change `--text-sm` → `--text-xs`

  Find:
  ```css
  .sec-ey{font-family:var(--font-mono);font-size: var(--text-sm);font-weight:600;letter-spacing:.18em;
  ```
  Replace with:
  ```css
  .sec-ey{font-family:var(--font-mono);font-size: var(--text-xs);font-weight:600;letter-spacing:.18em;
  ```

  **Line 269** — `.kpi-lbl`: change `--text-md` → `--text-sm`

  Find:
  ```css
  .kpi-lbl{font-size: var(--text-md);color:var(--t2);font-weight:500;margin-top:5px;}
  ```
  Replace with:
  ```css
  .kpi-lbl{font-size: var(--text-sm);color:var(--t2);font-weight:500;margin-top:5px;}
  ```

  **Line 277** — `.footer-l`: change `--text-md` → `--text-sm`

  Find:
  ```css
  .footer-l{font-size: var(--text-md);font-weight:500;color:var(--t3);}
  ```
  Replace with:
  ```css
  .footer-l{font-size: var(--text-sm);font-weight:500;color:var(--t3);}
  ```

  **Line 278** — `.footer-r`: change `--text-base` → `--text-sm`

  Find:
  ```css
  .footer-r{font-size: var(--text-base);color:var(--t4);}
  ```
  Replace with:
  ```css
  .footer-r{font-size: var(--text-sm);color:var(--t4);}
  ```

- [ ] **Step 3: Verify all 6 changes landed**

  ```bash
  grep -n "font-size: var(--text-" src/styles/rvc-base.css | grep -E "sec-ey|btn-blue|btn-outline|kpi-lbl|footer-l|footer-r"
  ```
  Expected — every line shows the new token:
  ```
  199:...font-size: var(--text-md);...   ← was --text-lg
  205:...font-size: var(--text-md);...   ← was --text-lg
  226:...font-size: var(--text-xs);...   ← was --text-sm
  269:.kpi-lbl{font-size: var(--text-sm);...  ← was --text-md
  277:.footer-l{font-size: var(--text-sm);... ← was --text-md
  278:.footer-r{font-size: var(--text-sm);... ← was --text-base
  ```

- [ ] **Step 4: Run tests**

  ```bash
  npx vitest run
  ```
  Expected: 3 test files, 11 tests, all pass.

- [ ] **Step 5: Commit**

  ```bash
  git add src/styles/rvc-base.css
  git commit -m "refactor(tokens): align eyebrow, button, kpi-lbl, footer font-size tokens"
  ```

---

## Task 2: Align report.css — sch-title and sch-sub

**Files:**
- Modify: `src/styles/report.css:67,68`

- [ ] **Step 1: Verify current state**

  ```bash
  grep -n "sch-title\|sch-sub" src/styles/report.css
  ```
  Expected:
  ```
  67:.sch-title{font-size: var(--text-lg);font-weight:700;color:var(--t1);letter-spacing:-.02em;}
  68:.sch-sub{font-size: var(--text-sm);color:var(--t3);margin-top:2px;}
  ```

- [ ] **Step 2: Apply both changes**

  **Line 67** — `.sch-title`: change `--text-lg` → `--text-xl`

  Find:
  ```css
  .sch-title{font-size: var(--text-lg);font-weight:700;color:var(--t1);letter-spacing:-.02em;}
  ```
  Replace with:
  ```css
  .sch-title{font-size: var(--text-xl);font-weight:700;color:var(--t1);letter-spacing:-.02em;}
  ```

  **Line 68** — `.sch-sub`: change `--text-sm` → `--text-base`

  Find:
  ```css
  .sch-sub{font-size: var(--text-sm);color:var(--t3);margin-top:2px;}
  ```
  Replace with:
  ```css
  .sch-sub{font-size: var(--text-base);color:var(--t3);margin-top:2px;}
  ```

- [ ] **Step 3: Verify both changes landed**

  ```bash
  grep -n "sch-title\|sch-sub" src/styles/report.css
  ```
  Expected:
  ```
  67:.sch-title{font-size: var(--text-xl);...   ← was --text-lg
  68:.sch-sub{font-size: var(--text-base);...   ← was --text-sm
  ```

- [ ] **Step 4: Cross-check ipo.css is already correct**

  ```bash
  grep -n "sch-title\|sch-sub" src/styles/ipo.css
  ```
  Expected (already correct, no change needed):
  ```
  101:.sch-title{font-size: var(--text-xl);...
  102:.sch-sub{font-size: var(--text-base);...
  ```

- [ ] **Step 5: Run tests**

  ```bash
  npx vitest run
  ```
  Expected: 3 test files, 11 tests, all pass.

- [ ] **Step 6: Commit**

  ```bash
  git add src/styles/report.css
  git commit -m "refactor(tokens): align sch-title and sch-sub font-size tokens with ipo.css"
  ```
