# Responsive Mobile Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate horizontal-overflow breakage on `/report` and `/ipo` at mobile widths, raise interactive controls to a 44px touch target, and add a small-phone polish pass — with no desktop or design-token changes.

**Architecture:** The two overflow bugs share one root cause: a wide data table inside a CSS grid `1fr` content column whose automatic `min-width:auto` expands to the table's min-content, blowing out the page. Fix = `min-width:0` on the content grid child (so it can shrink) + a `.table-scroll` wrapper (so the table scrolls inside its card). Touch targets and the `≤480px` pass are additive media-query rules.

**Tech Stack:** Plain CSS (no preprocessor), React 19 / Next.js 16 JSX. Vitest for regression. Live browser verification via the preview server measuring `document.documentElement.scrollWidth`.

---

## File Map

| File | Changes |
|---|---|
| `src/styles/rvc-base.css` | `.table-scroll` utility (~L213); touch targets in `@media(max-width:768px)` (L283–343) |
| `src/styles/report.css` | `.report-content` (L64) min-width:0; `.rsb-link` touch target + `@media(max-width:480px)` (after L118) |
| `src/styles/ipo.css` | `.ipo-content` (L96) min-width:0; `.isb-link` touch target + `@media(max-width:480px)` (after L237) |
| `src/styles/modules.css` | `@media(max-width:480px)` stats-strip (after L197) |
| `app/report/page.jsx` | Wrap 2 `.opp-table` tables (L298, L331) in `.table-scroll` |
| `app/ipo/page.jsx` | Wrap 1 `.ck-table` table (L250) in `.table-scroll` |

**Reusable verification snippet** (run in the preview page via `preview_eval`, for any path):
```js
(() => { const w = document.documentElement.clientWidth;
  return { path: location.pathname, viewport: w,
    overflow: document.documentElement.scrollWidth - w }; })()
```
Expected after each P0 task: `overflow: 0`.

---

## Task 1: Add the `.table-scroll` utility

**Files:**
- Modify: `src/styles/rvc-base.css` (after the `.btn-sm` block, ~L213)

- [ ] **Step 1: Verify the insertion point exists**

  ```bash
  grep -n "btn-sm:hover" src/styles/rvc-base.css
  ```
  Expected: a line near 213 — `.btn-sm:hover{background:var(--accent-soft);color:#e8edf5;}`

- [ ] **Step 2: Add the utility**

  Find:
  ```css
  .btn-sm:hover{background:var(--accent-soft);color:#e8edf5;}
  ```
  Replace with:
  ```css
  .btn-sm:hover{background:var(--accent-soft);color:#e8edf5;}

  /* ── Horizontally scrollable wrapper for wide data tables on small screens ── */
  .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  ```

- [ ] **Step 3: Verify it landed**

  ```bash
  grep -n "table-scroll" src/styles/rvc-base.css
  ```
  Expected: one line defining `.table-scroll{overflow-x:auto;...}`

- [ ] **Step 4: Commit**

  ```bash
  git add src/styles/rvc-base.css
  git commit -m "feat(responsive): add .table-scroll utility for wide tables"
  ```

---

## Task 2: Fix `/report` horizontal overflow

**Files:**
- Modify: `src/styles/report.css:64`
- Modify: `app/report/page.jsx:298,331`

- [ ] **Step 1: Verify current CSS state**

  ```bash
  grep -n "report-content{" src/styles/report.css
  ```
  Expected:
  ```
  64:.report-content{display:flex;flex-direction:column;gap:18px;}
  ```

- [ ] **Step 2: Constrain the content grid child**

  Find:
  ```css
  .report-content{display:flex;flex-direction:column;gap:18px;}
  ```
  Replace with:
  ```css
  .report-content{display:flex;flex-direction:column;gap:18px;min-width:0;}
  ```

- [ ] **Step 3: Wrap the first table (Opportunities, L298)**

  Find:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colOpportunity')}</th>
  ```
  Replace with:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <div className="table-scroll">
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colOpportunity')}</th>
  ```

  Then find (the close of that table):
  ```jsx
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risks */}
  ```
  Replace with:
  ```jsx
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Risks */}
  ```

- [ ] **Step 4: Wrap the second table (Risks, L331)**

  Find:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colRiskFactor')}</th>
  ```
  Replace with:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <div className="table-scroll">
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colRiskFactor')}</th>
  ```

  Then find (the close of that table):
  ```jsx
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Roadmap */}
  ```
  Replace with:
  ```jsx
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Roadmap */}
  ```

- [ ] **Step 5: Verify both wrappers + the CSS landed**

  ```bash
  grep -c "table-scroll" app/report/page.jsx && grep -n "min-width:0" src/styles/report.css
  ```
  Expected: `2` (two wrappers) and the `.report-content` line showing `min-width:0`.

- [ ] **Step 6: Verify zero overflow in the browser**

  Ensure the preview server is running, viewport set to mobile (375×812). Navigate to `/report` and run the verification snippet from the File Map.
  Expected: `{ path: "/report", viewport: 375, overflow: 0 }`

- [ ] **Step 7: Run tests**

  ```bash
  npx vitest run
  ```
  Expected: 3 test files, 11 tests, all pass.

- [ ] **Step 8: Commit**

  ```bash
  git add src/styles/report.css app/report/page.jsx
  git commit -m "fix(responsive): stop /report horizontal overflow at mobile widths"
  ```

---

## Task 3: Fix `/ipo` horizontal overflow

**Files:**
- Modify: `src/styles/ipo.css:96`
- Modify: `app/ipo/page.jsx:250`

- [ ] **Step 1: Verify current CSS state**

  ```bash
  grep -n "ipo-content{" src/styles/ipo.css
  ```
  Expected:
  ```
  96:.ipo-content{display:flex;flex-direction:column;gap:20px;}
  ```

- [ ] **Step 2: Constrain the content grid child**

  Find:
  ```css
  .ipo-content{display:flex;flex-direction:column;gap:20px;}
  ```
  Replace with:
  ```css
  .ipo-content{display:flex;flex-direction:column;gap:20px;min-width:0;}
  ```

- [ ] **Step 3: Wrap the checklist table (L250)**

  Find:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th style={{ width: '36px' }}></th>
  ```
  Replace with:
  ```jsx
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <div className="table-scroll">
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th style={{ width: '36px' }}></th>
  ```

  Then find (the close of that table):
  ```jsx
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Panel */}
  ```
  Replace with:
  ```jsx
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Risk Panel */}
  ```

- [ ] **Step 4: Verify wrapper + CSS landed**

  ```bash
  grep -c "table-scroll" app/ipo/page.jsx && grep -n "min-width:0" src/styles/ipo.css
  ```
  Expected: `1` and the `.ipo-content` line showing `min-width:0`.

- [ ] **Step 5: Verify zero overflow in the browser**

  Viewport mobile (375×812). Navigate to `/ipo` and run the verification snippet.
  Expected: `{ path: "/ipo", viewport: 375, overflow: 0 }`

- [ ] **Step 6: Run tests**

  ```bash
  npx vitest run
  ```
  Expected: 3 test files, 11 tests, all pass.

- [ ] **Step 7: Commit**

  ```bash
  git add src/styles/ipo.css app/ipo/page.jsx
  git commit -m "fix(responsive): stop /ipo horizontal overflow at mobile widths"
  ```

---

## Task 4: Touch targets ≥ 44px on mobile

**Files:**
- Modify: `src/styles/rvc-base.css` (inside `@media(max-width:768px)`, L283–343)
- Modify: `src/styles/report.css` (inside `@media(max-width:768px)`, L118)
- Modify: `src/styles/ipo.css` (inside `@media(max-width:768px)`, L226–237)

- [ ] **Step 1: Verify the rvc-base mobile nav rule**

  ```bash
  grep -n "min-height:38px" src/styles/rvc-base.css
  ```
  Expected: one line (the `.mob-nav a` block, ~L315).

- [ ] **Step 2: Bump the mobile nav pill to 44px**

  Find:
  ```css
    .mob-nav a{
      flex:0 0 auto;
      min-height:38px;
  ```
  Replace with:
  ```css
    .mob-nav a{
      flex:0 0 auto;
      min-height:44px;
  ```

- [ ] **Step 3: Add header-control touch targets**

  In `src/styles/rvc-base.css`, find (end of the `@media(max-width:768px)` block):
  ```css
    .sec-ttl{font-size: var(--text-3xl);}
    .btn-blue,.btn-outline{font-size: var(--text-md);padding:11px 20px;}
  }
  ```
  Replace with:
  ```css
    .sec-ttl{font-size: var(--text-3xl);}
    .btn-blue,.btn-outline{font-size: var(--text-md);padding:11px 20px;}
    .hdr-acts .btn-primary,.lang-toggle{min-height:44px;display:inline-flex;align-items:center;}
    .sb-link{min-height:44px;}
  }
  ```

- [ ] **Step 4: Add report sidebar-link touch target**

  In `src/styles/report.css`, find:
  ```css
  @media(max-width:768px){.report-wrap{padding:0 20px;}.report-head-card{flex-direction:column;}.radar-wrap{flex-direction:column;}}
  ```
  Replace with:
  ```css
  @media(max-width:768px){.report-wrap{padding:0 20px;}.report-head-card{flex-direction:column;}.radar-wrap{flex-direction:column;}.rsb-link{min-height:44px;}}
  ```

- [ ] **Step 5: Add ipo sidebar-link touch target**

  In `src/styles/ipo.css`, find:
  ```css
    .action-grid{grid-template-columns:1fr;}
    .prog-summary{grid-template-columns:repeat(3,1fr);}
  }
  ```
  Replace with:
  ```css
    .action-grid{grid-template-columns:1fr;}
    .prog-summary{grid-template-columns:repeat(3,1fr);}
    .isb-link{min-height:44px;}
  }
  ```

- [ ] **Step 6: Verify in the browser**

  Viewport mobile. On `/report`, run:
  ```js
  (() => [...document.querySelectorAll('.btn-primary,.lang-toggle,.mob-nav a,.rsb-link')]
    .map(e => ({c:e.className.toString().slice(0,16), h:Math.round(e.getBoundingClientRect().height)}))
    .filter(x => x.h > 0 && x.h < 44))()
  ```
  Expected: `[]` (empty — nothing under 44px).

- [ ] **Step 7: Commit**

  ```bash
  git add src/styles/rvc-base.css src/styles/report.css src/styles/ipo.css
  git commit -m "fix(a11y): raise mobile touch targets to 44px"
  ```

---

## Task 5: Small-phone (`≤480px`) polish

**Files:**
- Modify: `src/styles/ipo.css` (append after L237)
- Modify: `src/styles/report.css` (append after L118)
- Modify: `src/styles/modules.css` (append after L197)

- [ ] **Step 1: Verify file ends**

  ```bash
  tail -1 src/styles/ipo.css; tail -1 src/styles/report.css; tail -1 src/styles/modules.css
  ```
  Expected: each ends with a `}` closing the last media query / rule.

- [ ] **Step 2: Append ipo small-phone block**

  At the end of `src/styles/ipo.css`, after the closing `}` of the `@media(max-width:768px)` block, add:
  ```css
  @media(max-width:480px){
    .ipo-wrap{padding:0 16px;}
    .ipo-top{padding:20px 16px;}
    .prog-summary{grid-template-columns:1fr 1fr;}
  }
  ```

- [ ] **Step 3: Append report small-phone block**

  At the end of `src/styles/report.css`, add:
  ```css
  @media(max-width:480px){
    .report-wrap{padding:0 16px;}
    .report-head-card{padding:20px 16px;}
  }
  ```

- [ ] **Step 4: Append modules small-phone block**

  At the end of `src/styles/modules.css`, add:
  ```css
  @media(max-width:480px){
    .stats-strip{grid-template-columns:1fr;}
  }
  ```

- [ ] **Step 5: Verify the three blocks landed**

  ```bash
  grep -c "max-width:480px" src/styles/ipo.css src/styles/report.css src/styles/modules.css
  ```
  Expected: each file reports `1`.

- [ ] **Step 6: Verify no overflow at 480px and 375px**

  In the preview, resize to 480px wide, visit `/ipo`, `/report`, `/modules`, run the overflow snippet on each (expect `overflow: 0`). Repeat at 375px.

- [ ] **Step 7: Commit**

  ```bash
  git add src/styles/ipo.css src/styles/report.css src/styles/modules.css
  git commit -m "feat(responsive): add 480px small-phone polish for stat grids"
  ```

---

## Task 6: Final cross-page verification

- [ ] **Step 1: Overflow sweep across all five pages**

  Viewport mobile (375×812). For each of `/`, `/intake`, `/modules`, `/report`, `/ipo`, navigate and run the overflow snippet.
  Expected: every page reports `overflow: 0`.

- [ ] **Step 2: Visual confirmation**

  Screenshot `/report` (scrolled to the Opportunities table) and `/ipo` (scrolled to the checklist table). Confirm: no content clipped off the right edge, no dark background gap on the right, tables scroll horizontally inside their cards.

- [ ] **Step 3: Full test run**

  ```bash
  npx vitest run
  ```
  Expected: 3 test files, 11 tests, all pass.

---

## Self-Review Notes

- **Spec coverage:** Tasks 1–3 cover P0 (overflow); Task 4 covers P1 (touch targets); Task 5 covers P2 (small-phone). Task 6 = success-criteria verification. All spec "Changes" map to a task.
- **No desktop regression:** every CSS addition is either inside a `max-width` media query or a `min-width:0`/utility that is inert above 900px.
- **Type/selector consistency:** `.table-scroll` is defined once (Task 1) and referenced by exact class name in Tasks 2–3. `min-width:0` targets the real flex-column content wrappers (`.report-content`, `.ipo-content`) confirmed in source.
