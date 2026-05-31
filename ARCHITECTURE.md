# RVC Platform — Architecture

The source of truth for product structure, tech stack, routing, and data conventions.
Read before adding pages, components, or locale keys. When this doc and the code disagree,
**the code wins** — update the doc.

---

## 1 · Product

**RVC Enterprise Value Diagnostic Platform** — AI-driven enterprise health check and
capital-path execution platform. Core user journey:

```
Home → Intake Console → (AI Scan) → Diagnostic Report → Execution Modules → IPO Readiness
```

Target audience: enterprise clients evaluating IPO, M&A, financing, or governance paths.
Register: institutional, capital-market-grade. Not a consumer product.

---

## 2 · Tech Stack

| Layer         | Choice                                      |
| ------------- | ------------------------------------------- |
| UI framework  | React 19                                    |
| Build tool    | Next.js 16 (App Router)                     |
| Routing       | Next.js App Router (file-based)             |
| i18n          | i18next + react-i18next (zh default, en)    |
| Styling       | Plain CSS — one base file + per-page files  |
| Testing       | Vitest                                      |
| Deployment    | Vercel (Next.js — App Router)               |

No component library (shadcn, MUI, etc.).
No TypeScript yet — `.jsx` throughout.

---

## 3 · Directory Structure

```
app/
  layout.jsx               # root layout: CSS imports, ClientProviders, NavWrapper, {children}
  ClientProviders.jsx      # "use client" — i18n initialisation and I18nextProvider
  NavWrapper.jsx           # "use client" — mobileOpen state, renders Header + MobileNav
  page.jsx                 # / — landing (dark)
  intake/
    page.jsx               # /intake — enterprise intake console
  report/
    page.jsx               # /report — diagnostic report dashboard
  modules/
    page.jsx               # /modules — recommended execution paths
  ipo/
    page.jsx               # /ipo — IPO readiness console
src/
  i18n.js                  # i18next init; persists lang to localStorage
  config/
    nav.js                 # shared nav link definitions (label keys + paths)
  components/
    Header.jsx             # sticky top nav; desktop links + hamburger
    MobileNav.jsx          # slide-in mobile drawer
  styles/
    rvc-base.css           # global tokens, resets, shared utilities
    index.css              # landing-page-specific styles
    intake.css
    report.css
    modules.css
    ipo.css
  locales/
    zh.json                # Chinese strings (default)
    en.json                # English strings
```

---

## 4 · Routing

All routes use Next.js App Router file-based routing. Each route is an `app/*/page.jsx` file.

| Path       | Component    | Description                        |
| ---------- | ------------ | ---------------------------------- |
| `/`        | `Index`      | Landing — brand & value prop       |
| `/intake`  | `Intake`     | 7-step enterprise data intake form |
| `/report`  | `Report`     | AI diagnostic report dashboard     |
| `/modules` | `Modules`    | Execution module cards + filters   |
| `/ipo`     | `Ipo`        | IPO readiness console              |

`Header` and `MobileNav` are rendered in `app/layout.jsx` via `NavWrapper` and appear on every page.

---

## 5 · i18n

- Default language: `en`. Falls back to `en`.
- Language persisted in `localStorage` under key `rvc-lang`.
- Language toggle sets `<html lang="zh-CN" | "en">` via `#html-root`.
- All user-facing strings live in `src/locales/{zh,en}.json`.
- Operational chrome (codes, tags, nav earmarks) stays identical across locales.
- When adding a key: add to **both** locale files. Missing keys render `undefined`.

---

## 6 · CSS Conventions

- **One base file** — `rvc-base.css` owns all design tokens (CSS custom properties)
  and shared utility classes. Page CSS files scope to their own components only.
- **No inline `style={{}}`** beyond dynamic token assignment (e.g. `style={{ '--progress': pct }}`).
- Token names follow `--{role}` — e.g. `--bg`, `--accent`, `--t1`. See `DESIGN.md` for the full token table.
- **`.light-theme`** class on a page root overrides tokens to light values. Currently applied
  to `/intake`, `/report`, `/modules`, `/ipo`. Landing (`/`) stays dark.

---

## 7 · Component Inventory

### Shared (rendered on every page)

| Component    | File                        | Notes                                         |
| ------------ | --------------------------- | --------------------------------------------- |
| `Header`     | `components/Header.jsx`     | Sticky; active route highlighted via `usePathname` from next/navigation |
| `MobileNav`  | `components/MobileNav.jsx`  | Drawer; controlled by `mobileOpen` in `App`   |

### Page components

Each page file is self-contained — it owns its markup, local state, and imports its own CSS.
No shared sub-components yet; extract when a pattern appears in ≥ 2 pages.

Candidates for future extraction:
- `ScoreGauge` (report + ipo)
- `ModuleCard` (modules + report recommended paths)
- `ProgressBar` (intake + modules)
- `RiskTag` (report + ipo)

---

## 8 · State

No global state library. Each page manages its own local state with `useState` / `useEffect`.
- Intake: `currentStep` controls the active form panel.
- Modules: filter + search state local to `Modules.jsx`.
- No server data — all content is hardcoded mock data inside page components.

When a real API is introduced, use a lightweight option (Zustand or SWR) rather than
lifting state through the router.

---

## 9 · Mock Data

All mock values are hardcoded inside page components. Consistent numbers that must
stay in sync across pages:

| Metric              | Value       |
| ------------------- | ----------- |
| Overall score       | 72 / 100    |
| Percentile          | Top 28%     |
| Platform advisors   | 320+        |
| Cumulative value    | $42B+       |
| Enterprises served  | 2,486+      |

Global search for these values before changing any one occurrence.

---

## 10 · Testing

- Runner: Vitest
- `Header.test.jsx` — smoke tests for nav rendering
- `i18n.test.js` — locale key presence checks
- Run: `npm test`

---

## 11 · Deployment

- Platform: Vercel
- Config: `vercel.json` sets `buildCommand: next build` and `outputDirectory: .next`; no rewrites needed
- Assets excluded from deploy: design PDFs, raw images — see `.vercelignore`
- `logo.svg` is the only runtime image asset
- `/og-cover.png` referenced in `Index.jsx` meta tag — file not yet included
