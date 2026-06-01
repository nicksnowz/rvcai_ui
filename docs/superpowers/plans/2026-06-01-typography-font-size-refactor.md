# Typography Font-Size Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 98 hard-coded `font-size` pixel values across 6 CSS files with 21 semantic CSS custom properties, reducing font-size variance to zero raw-px declarations (outside documented edge cases).

**Architecture:** Define the token scale once in `rvc-base.css :root`, then mechanically replace every raw pixel value in each CSS file using a Perl in-place substitution script. Edge-case values (1–5px, 600px, 680px, `.em` fractions) are left untouched and documented.

**Tech Stack:** Pure CSS custom properties. Perl one-liners for in-place file editing (ships with macOS/Linux, more reliable than BSD sed for multi-expression edits). Vitest + jsdom for existing component test suite.

---

## File Map

| File | Role |
|---|---|
| `src/styles/rvc-base.css` | **Defines tokens** in `:root`; also has ~32 font-size declarations to replace |
| `src/styles/index.css` | 124 font-size declarations — largest file; also contains all 9 clamp() values |
| `src/styles/ipo.css` | 39 declarations |
| `src/styles/report.css` | 35 declarations |
| `src/styles/intake.css` | 26 declarations |
| `src/styles/modules.css` | 23 declarations |
| `scripts/tokenize-font-sizes.sh` | **New** — reusable replacement script, applied per-file |

---

## Task 1: Add font-size tokens to rvc-base.css

**Files:**
- Modify: `src/styles/rvc-base.css:8-11`

- [ ] **Step 1: Insert the type scale token block into :root**

  Open `src/styles/rvc-base.css`. After line 11 (the `--font-hero` declaration), insert the following block. The `:root` block already exists — add inside it, after the font-family variables and before the blank line that precedes the accent color block.

  The `--font-hero` line currently reads:
  ```
    --font-hero:'Spectral','Noto Sans SC','PingFang SC','Microsoft YaHei',ui-serif,Georgia,serif;
  ```

  Insert immediately after it:
  ```css
    /* Type scale */
    --text-2xs:8px;
    --text-xs:10px;
    --text-sm:11px;
    --text-base:12px;
    --text-md:13px;
    --text-lg:14px;
    --text-xl:16px;
    --text-2xl:20px;
    --text-3xl:24px;
    --text-4xl:32px;
    --text-5xl:44px;
    --text-6xl:64px;
    --text-fluid-xs:clamp(22px,2.4vw,32px);
    --text-fluid-sm:clamp(26px,3vw,42px);
    --text-fluid-sm-alt:clamp(26px,3.2vw,42px);
    --text-fluid-md:clamp(34px,4.4vw,56px);
    --text-fluid-md-alt:clamp(34px,4.8vw,60px);
    --text-fluid-lg:clamp(68px,20vw,110px);
    --text-fluid-xl:clamp(96px,16vw,180px);
    --text-fluid-2xl:clamp(160px,12vw,210px);
    --text-fluid-3xl:clamp(190px,13vw,240px);
  ```

- [ ] **Step 2: Run baseline count**

  ```bash
  grep -rE "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/ | wc -l
  ```
  Expected: a large number (≥250). This is your starting point — record it.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/rvc-base.css
  git commit -m "feat(tokens): add font-size CSS custom properties to :root"
  ```

---

## Task 2: Create the tokenization script

**Files:**
- Create: `scripts/tokenize-font-sizes.sh`

- [ ] **Step 1: Create the script**

  Create `scripts/tokenize-font-sizes.sh` with this content:

  ```bash
  #!/bin/bash
  # Usage: ./scripts/tokenize-font-sizes.sh <path/to/file.css>
  # Replaces all mappable raw pixel font-size values with CSS custom property var() calls.
  # Edge cases (1-5px, 600px, 680px, .em values) are intentionally skipped.
  FILE="$1"
  [[ -z "$FILE" ]] && { echo "Usage: $0 <file.css>"; exit 1; }

  perl -pi -e '
    # ── Interface tier ──────────────────────────────────
    # Process X.5px before Xpx to avoid partial matches
    s/font-size: *8\.5px/font-size: var(--text-2xs)/g;
    s/font-size: *9\.5px/font-size: var(--text-2xs)/g;
    s/font-size: *7px/font-size: var(--text-2xs)/g;
    s/font-size: *8px/font-size: var(--text-2xs)/g;
    s/font-size: *9px/font-size: var(--text-2xs)/g;

    s/font-size: *10\.5px/font-size: var(--text-xs)/g;
    s/font-size: *10px/font-size: var(--text-xs)/g;

    s/font-size: *11\.5px/font-size: var(--text-sm)/g;
    s/font-size: *11px/font-size: var(--text-sm)/g;

    s/font-size: *12\.5px/font-size: var(--text-base)/g;
    s/font-size: *12px/font-size: var(--text-base)/g;

    s/font-size: *13\.5px/font-size: var(--text-md)/g;
    s/font-size: *13px/font-size: var(--text-md)/g;

    s/font-size: *14\.5px/font-size: var(--text-lg)/g;
    s/font-size: *14px/font-size: var(--text-lg)/g;

    s/font-size: *15px/font-size: var(--text-xl)/g;
    s/font-size: *16\.5px/font-size: var(--text-xl)/g;
    s/font-size: *16px/font-size: var(--text-xl)/g;
    s/font-size: *17\.5px/font-size: var(--text-xl)/g;
    s/font-size: *17px/font-size: var(--text-xl)/g;

    # ── Heading tier ────────────────────────────────────
    s/font-size: *18\.5px/font-size: var(--text-2xl)/g;
    s/font-size: *18px/font-size: var(--text-2xl)/g;
    s/font-size: *19px/font-size: var(--text-2xl)/g;
    s/font-size: *20px/font-size: var(--text-2xl)/g;

    s/font-size: *22px/font-size: var(--text-3xl)/g;
    s/font-size: *24px/font-size: var(--text-3xl)/g;
    s/font-size: *26px/font-size: var(--text-3xl)/g;

    s/font-size: *28px/font-size: var(--text-4xl)/g;
    s/font-size: *30px/font-size: var(--text-4xl)/g;
    s/font-size: *32px/font-size: var(--text-4xl)/g;
    s/font-size: *34px/font-size: var(--text-4xl)/g;
    s/font-size: *36px/font-size: var(--text-4xl)/g;

    s/font-size: *40px/font-size: var(--text-5xl)/g;
    s/font-size: *42px/font-size: var(--text-5xl)/g;
    s/font-size: *44px/font-size: var(--text-5xl)/g;
    s/font-size: *46px/font-size: var(--text-5xl)/g;
    s/font-size: *48px/font-size: var(--text-5xl)/g;
    s/font-size: *52px/font-size: var(--text-5xl)/g;

    s/font-size: *54px/font-size: var(--text-6xl)/g;
    s/font-size: *58px/font-size: var(--text-6xl)/g;
    s/font-size: *60px/font-size: var(--text-6xl)/g;
    s/font-size: *64px/font-size: var(--text-6xl)/g;
    s/font-size: *66px/font-size: var(--text-6xl)/g;
    s/font-size: *68px/font-size: var(--text-6xl)/g;
    s/font-size: *72px/font-size: var(--text-6xl)/g;
    s/font-size: *74px/font-size: var(--text-6xl)/g;

    # ── Fluid tier (clamp) ──────────────────────────────
    s|font-size: *clamp\(22px,2\.4vw,32px\)|font-size: var(--text-fluid-xs)|g;
    s|font-size: *clamp\(26px,3vw,42px\)|font-size: var(--text-fluid-sm)|g;
    s|font-size: *clamp\(26px,3\.2vw,42px\)|font-size: var(--text-fluid-sm-alt)|g;
    s|font-size: *clamp\(34px,4\.4vw,56px\)|font-size: var(--text-fluid-md)|g;
    s|font-size: *clamp\(34px,4\.8vw,60px\)|font-size: var(--text-fluid-md-alt)|g;
    s|font-size: *clamp\(68px,20vw,110px\)|font-size: var(--text-fluid-lg)|g;
    s|font-size: *clamp\(96px,16vw,180px\)|font-size: var(--text-fluid-xl)|g;
    s|font-size: *clamp\(160px,12vw,210px\)|font-size: var(--text-fluid-2xl)|g;
    s|font-size: *clamp\(190px,13vw,240px\)|font-size: var(--text-fluid-3xl)|g;
  ' "$FILE"

  echo "Done: $FILE"
  ```

- [ ] **Step 2: Make it executable**

  ```bash
  chmod +x scripts/tokenize-font-sizes.sh
  ```

- [ ] **Step 3: Dry-run to verify the script works (no changes yet)**

  Copy index.css to a temp file and run on it to check output is sensible:
  ```bash
  cp src/styles/index.css /tmp/index-test.css
  ./scripts/tokenize-font-sizes.sh /tmp/index-test.css
  grep "var(--text" /tmp/index-test.css | head -10
  ```
  Expected: lines like `font-size: var(--text-xs)` — confirms substitutions work.

- [ ] **Step 4: Commit the script**

  ```bash
  git add scripts/tokenize-font-sizes.sh
  git commit -m "chore: add font-size tokenization script"
  ```

---

## Task 3: Replace font-size values in index.css

**Files:**
- Modify: `src/styles/index.css`

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/index.css
  ```

- [ ] **Step 2: Verify replacements**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/index.css
  ```
  Expected output: only edge-case lines (values in the 1–5px range and any missed entries). No lines with values ≥6px should remain.

  Also confirm variables were introduced:
  ```bash
  grep "var(--text" src/styles/index.css | wc -l
  ```
  Expected: a significant positive number (≥40).

- [ ] **Step 3: Run existing tests to confirm no regressions in component logic**

  ```bash
  npx vitest run
  ```
  Expected: all tests pass (tests are component-level, not CSS-level — this confirms no JS was accidentally altered).

- [ ] **Step 4: Commit**

  ```bash
  git add src/styles/index.css
  git commit -m "refactor(tokens): tokenize font-size values in index.css"
  ```

---

## Task 4: Replace font-size values in ipo.css

**Files:**
- Modify: `src/styles/ipo.css`

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/ipo.css
  ```

- [ ] **Step 2: Verify**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/ipo.css
  ```
  Expected: only edge-case values (1–5px) or empty output.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/ipo.css
  git commit -m "refactor(tokens): tokenize font-size values in ipo.css"
  ```

---

## Task 5: Replace font-size values in report.css

**Files:**
- Modify: `src/styles/report.css`

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/report.css
  ```

- [ ] **Step 2: Verify**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/report.css
  ```
  Expected: only edge-case values or empty output.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/report.css
  git commit -m "refactor(tokens): tokenize font-size values in report.css"
  ```

---

## Task 6: Replace font-size values in rvc-base.css (body declarations)

**Files:**
- Modify: `src/styles/rvc-base.css`

Note: Task 1 already added the token definitions to `:root`. This task replaces the raw pixel values in the rest of the file's rules.

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/rvc-base.css
  ```

- [ ] **Step 2: Verify**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/rvc-base.css
  ```
  Expected: only edge-case values or empty output. The token definitions in `:root` use `--text-*:Npx` format (not `font-size:`) so they won't be matched.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/rvc-base.css
  git commit -m "refactor(tokens): tokenize font-size values in rvc-base.css"
  ```

---

## Task 7: Replace font-size values in intake.css

**Files:**
- Modify: `src/styles/intake.css`

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/intake.css
  ```

- [ ] **Step 2: Verify**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/intake.css
  ```
  Expected: only edge-case values or empty output.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/intake.css
  git commit -m "refactor(tokens): tokenize font-size values in intake.css"
  ```

---

## Task 8: Replace font-size values in modules.css

**Files:**
- Modify: `src/styles/modules.css`

- [ ] **Step 1: Run the tokenization script**

  ```bash
  ./scripts/tokenize-font-sizes.sh src/styles/modules.css
  ```

- [ ] **Step 2: Verify**

  ```bash
  grep -E "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/modules.css
  ```
  Expected: only edge-case values or empty output.

- [ ] **Step 3: Commit**

  ```bash
  git add src/styles/modules.css
  git commit -m "refactor(tokens): tokenize font-size values in modules.css"
  ```

---

## Task 9: Audit and document edge cases

**Files:**
- No changes — audit only

- [ ] **Step 1: Find all remaining raw font-size values across all CSS files**

  ```bash
  grep -rn "font-size:" src/styles/ | grep -vE "var\(--text" | grep -vE "var\(--font"
  ```
  This shows every `font-size:` line that is NOT yet using a variable.

- [ ] **Step 2: Categorize each remaining line**

  For each line in the output, check whether it falls into one of these expected edge-case categories:

  | Category | Values | Action |
  |---|---|---|
  | CSS tricks / invisible spacers | 1px, 2px, 3px, 4px, 5px | Leave as-is — these are not readable text |
  | Non-standard large values | 600px, 680px | Investigate the rule — may be a calculation hack |
  | Relative em fractions | `.02em`–`.56em`, `3.3em` | Leave as-is — relative to a parent font-size |
  | Any unexpected value | anything else | Must be tokenized — add a new token if needed |

- [ ] **Step 3: Handle any unexpected values**

  If step 2 reveals a value NOT in the edge-case categories (e.g., a missed `21px`), add it to the tokenization script and re-run:

  ```bash
  # Example: if 21px was missed, add to the script between 20px and 22px mappings:
  # s/font-size: *21px/font-size: var(--text-2xl)/g;
  # Then re-run on the affected file:
  ./scripts/tokenize-font-sizes.sh src/styles/<affected-file>.css
  git add src/styles/<affected-file>.css
  git commit -m "refactor(tokens): catch missed font-size value in <affected-file>.css"
  ```

- [ ] **Step 4: Final test run**

  ```bash
  npx vitest run
  ```
  Expected: all tests pass.

---

## Task 10: Final verification

- [ ] **Step 1: Count remaining raw pixel font-size declarations (should be only edge cases)**

  ```bash
  grep -rE "font-size:\s*[0-9]+(\.[0-9]+)?px" src/styles/ | grep -vE "font-size:\s*[1-5]px"
  ```
  Expected: empty output (zero non-edge-case raw pixel values remaining).

- [ ] **Step 2: Confirm all 21 tokens are defined in rvc-base.css**

  ```bash
  grep -c "var(--text-" src/styles/rvc-base.css src/styles/index.css src/styles/ipo.css src/styles/report.css src/styles/intake.css src/styles/modules.css
  ```
  Expected: each file shows a positive count; rvc-base.css shows the most.

  ```bash
  grep "^  --text-" src/styles/rvc-base.css
  ```
  Expected: all 21 `--text-*` variables listed.

- [ ] **Step 3: Final commit**

  ```bash
  git add -p  # stage any outstanding changes
  git commit -m "refactor(tokens): typography font-size refactor complete — 21 CSS variables, zero raw px"
  ```
