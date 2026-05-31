# Next.js Migration Design

## Goal

Migrate the RVC platform from Vite + React Router 7 to Next.js 15 App Router, keeping all existing functionality, styling, and i18n intact. No visual changes. No new features.

## Architecture

Replace the Vite SPA with a Next.js App Router project. All 5 pages become client components (they rely on `useState`/`useEffect`). A thin `ClientProviders` wrapper handles i18n initialization client-side. Plain CSS files are unchanged — all imported from the root layout.

## Tech Stack Changes

| Layer | Before | After |
|---|---|---|
| Build tool | Vite 8 | Next.js 15 |
| Routing | React Router 7 (`BrowserRouter`) | Next.js App Router (file-based) |
| Entry | `main.jsx` + `App.jsx` | `app/layout.jsx` |
| Active route detection | `useLocation()` from react-router-dom | `usePathname()` from next/navigation |

Everything else is unchanged: React 19, plain CSS, i18next + react-i18next, Vitest, Vercel.

## File Mapping

```
DELETED
  src/main.jsx
  src/App.jsx
  vite.config.js
  index.html

ADDED
  app/layout.jsx          — root layout: imports CSS, renders ClientProviders + Header + MobileNav + {children}
  app/ClientProviders.jsx — "use client": initializes i18n, wraps children with I18nextProvider
  app/page.jsx            — route /        (was src/pages/Index.jsx, add "use client")
  app/intake/page.jsx     — route /intake  (was src/pages/Intake.jsx, add "use client")
  app/report/page.jsx     — route /report  (was src/pages/Report.jsx, add "use client")
  app/modules/page.jsx    — route /modules (was src/pages/Modules.jsx, add "use client")
  app/ipo/page.jsx        — route /ipo     (was src/pages/Ipo.jsx, add "use client")
  next.config.js          — minimal Next.js config

MODIFIED
  package.json            — remove vite/react-router-dom, add next; update scripts
  vercel.json             — remove SPA rewrite (Next.js handles routing natively)
  src/components/Header.jsx    — add "use client"; useLocation → usePathname
  src/components/MobileNav.jsx — add "use client"
  src/components/Header.test.jsx — swap MemoryRouter mock for next/navigation mock
  ARCHITECTURE.md         — update stack, directory structure, routing, deployment sections

UNCHANGED
  src/i18n.js
  src/config/nav.js
  src/locales/
  src/styles/
  src/i18n.test.js
```

## i18n Strategy

`i18n.js` uses `localStorage` — browser-only. Solution:

1. `app/ClientProviders.jsx` marked `"use client"`, imports and initializes i18n, wraps `children` in `I18nextProvider`.
2. `app/layout.jsx` is a server component that renders `ClientProviders` around the page slot.
3. All page components add `"use client"` (they already rely on hooks throughout).
4. `Header.jsx` and `MobileNav.jsx` add `"use client"` — both use hooks.

## CSS Strategy

Next.js App Router allows global CSS only from `app/layout.jsx`. All CSS files are already scoped by class naming convention (`.index-*`, `.intake-*`, etc.) so importing all of them from layout causes no style conflicts.

```js
// app/layout.jsx imports
import '../src/styles/rvc-base.css'
import '../src/styles/index.css'
import '../src/styles/intake.css'
import '../src/styles/report.css'
import '../src/styles/modules.css'
import '../src/styles/ipo.css'
```

## Routing

| Path | File | Notes |
|---|---|---|
| `/` | `app/page.jsx` | |
| `/intake` | `app/intake/page.jsx` | |
| `/report` | `app/report/page.jsx` | |
| `/modules` | `app/modules/page.jsx` | |
| `/ipo` | `app/ipo/page.jsx` | |

`Header` and `MobileNav` rendered in `app/layout.jsx`, appear on every page.

## Testing

Vitest stays. `Header.test.jsx` currently wraps with React Router's `MemoryRouter` — replace with:

```js
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
```

`i18n.test.js` unchanged.

## Deployment

Vercel has first-class Next.js support. Remove the `/*` → `/index.html` rewrite from `vercel.json`. No other Vercel config needed.

## Out of Scope

- No SSR or SSG — all pages remain client components
- No TypeScript
- No Tailwind
- No new features or visual changes
- No API routes
