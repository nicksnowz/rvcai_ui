# Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the RVC platform from Vite + React Router 7 to Next.js 15 App Router with no visual or functional changes.

**Architecture:** Replace Vite entry + React Router with Next.js App Router file-based routing. All 5 pages become `"use client"` components (they all use hooks). A `ClientProviders` wrapper initialises i18n on the client side. A `NavWrapper` client component owns the `mobileOpen` state previously held in `App.jsx`.

**Tech Stack:** Next.js 15, React 19, i18next + react-i18next, Vitest + @vitejs/plugin-react, plain CSS, Vercel.

---

### Task 1: Swap dependencies and scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Next.js**

```bash
npm install next
```

Expected: `package.json` dependencies now includes `"next": "^15.x.x"`.

- [ ] **Step 2: Uninstall Vite, React Router, and Vite-specific ESLint plugin**

```bash
npm uninstall vite react-router-dom eslint-plugin-react-refresh
```

Keep `@vitejs/plugin-react` — it is still needed by Vitest for JSX transformation.

- [ ] **Step 3: Update scripts in package.json**

Replace the `"scripts"` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Run tests to confirm no regressions yet**

```bash
npm test
```

Expected: all tests pass (Header smoke tests + i18n key tests). Tests still use the old `MemoryRouter` wrapper — that is fine for now; it gets updated in Task 10.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install next.js, remove vite and react-router-dom"
```

---

### Task 2: Config files — next.config.js, vitest.config.js, vercel.json

**Files:**
- Create: `next.config.js`
- Create: `vitest.config.js`
- Modify: `vercel.json`

- [ ] **Step 1: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

- [ ] **Step 2: Create vitest.config.js**

The test configuration currently lives inside `vite.config.js`. Move it to a standalone file so Vitest can find it after `vite.config.js` is deleted in Task 12.

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
});
```

- [ ] **Step 3: Run tests with the new Vitest config**

```bash
npm test
```

Expected: same results as before — all tests pass.

- [ ] **Step 4: Update vercel.json**

Remove the `rewrites` array (Next.js handles routing natively). Update build command, output directory, and cache header source path:

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

- [ ] **Step 5: Commit**

```bash
git add next.config.js vitest.config.js vercel.json
git commit -m "chore: add next.config.js and vitest.config.js; update vercel.json for next.js"
```

---

### Task 3: Root layout — app/layout.jsx, ClientProviders.jsx, NavWrapper.jsx

These three files replace `src/main.jsx` and `src/App.jsx`.

**Files:**
- Create: `app/ClientProviders.jsx`
- Create: `app/NavWrapper.jsx`
- Create: `app/layout.jsx`

- [ ] **Step 1: Create app/ClientProviders.jsx**

This is a `"use client"` wrapper that initialises i18n (which reads `localStorage`) and provides the i18n context to the tree. `src/i18n.js` already guards `localStorage` access so it is safe to import here.

```jsx
'use client';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

export default function ClientProviders({ children }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

- [ ] **Step 2: Create app/NavWrapper.jsx**

Extracts the `mobileOpen` state that previously lived in `App.jsx`.

```jsx
'use client';
import { useState } from 'react';
import Header from '../src/components/Header';
import MobileNav from '../src/components/MobileNav';

export default function NavWrapper() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <Header
        mobileNavOpen={mobileOpen}
        onHamburgerClick={() => setMobileOpen(o => !o)}
      />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
```

- [ ] **Step 3: Create app/layout.jsx**

This is a server component (no `"use client"`). It owns the `<html>` and `<body>` tags and imports all CSS globally. The `id="html-root"` on `<html>` is required — `src/i18n.js` calls `document.getElementById('html-root')` to set the `lang` attribute when the language changes.

```jsx
import '../src/styles/rvc-base.css';
import '../src/styles/index.css';
import '../src/styles/intake.css';
import '../src/styles/report.css';
import '../src/styles/modules.css';
import '../src/styles/ipo.css';
import ClientProviders from './ClientProviders';
import NavWrapper from './NavWrapper';

export const metadata = {
  title: 'RVC Capital — Enterprise Value Diagnostic',
  description: 'AI-driven enterprise health check and capital-path execution platform.',
};

export default function RootLayout({ children }) {
  return (
    <html id="html-root">
      <body>
        <ClientProviders>
          <NavWrapper />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.jsx app/ClientProviders.jsx app/NavWrapper.jsx
git commit -m "feat: add next.js root layout with client providers and nav wrapper"
```

---

### Task 4: Update Header.jsx

**Files:**
- Modify: `src/components/Header.jsx`

Changes: add `'use client'`, swap `react-router-dom` for Next.js equivalents, `to=` → `href=`.

- [ ] **Step 1: Replace the import line and add directive**

Current line 1:
```js
import { Link, useLocation } from 'react-router-dom';
```

Replace the entire top of the file (lines 1–3) with:
```jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';
```

- [ ] **Step 2: Replace useLocation with usePathname**

Current line 7:
```js
const { pathname } = useLocation();
```

Replace with:
```js
const pathname = usePathname();
```

- [ ] **Step 3: Update Link props — logo link**

Current:
```jsx
<Link to="/" className="logo">
```

Replace with:
```jsx
<Link href="/" className="logo">
```

- [ ] **Step 4: Update Link props — nav links**

Current:
```jsx
<Link key={to} to={to} className={pathname === to ? 'active' : undefined}>
```

Replace with:
```jsx
<Link key={to} href={to} className={pathname === to ? 'active' : undefined}>
```

- [ ] **Step 5: Update Link props — CTA button**

Current:
```jsx
<Link to="/intake" className="btn-primary">{t('nav.startDiagnosis')}</Link>
```

Replace with:
```jsx
<Link href="/intake" className="btn-primary">{t('nav.startDiagnosis')}</Link>
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: Header tests still pass (they still use `MemoryRouter` — that gets removed in Task 10 after MobileNav is updated too).

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.jsx
git commit -m "refactor: migrate Header.jsx to next/link and usePathname"
```

---

### Task 5: Update MobileNav.jsx

**Files:**
- Modify: `src/components/MobileNav.jsx`

- [ ] **Step 1: Replace import line and add directive**

Current line 1:
```js
import { Link, useLocation } from 'react-router-dom';
```

Replace the top two lines with:
```jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';
```

- [ ] **Step 2: Replace useLocation**

Current:
```js
const { pathname } = useLocation();
```

Replace with:
```js
const pathname = usePathname();
```

- [ ] **Step 3: Update Link props**

Current:
```jsx
<Link
  key={to}
  to={to}
  className={pathname === to ? 'active' : undefined}
  onClick={onClose}
>
```

Replace with:
```jsx
<Link
  key={to}
  href={to}
  className={pathname === to ? 'active' : undefined}
  onClick={onClose}
>
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/MobileNav.jsx
git commit -m "refactor: migrate MobileNav.jsx to next/link and usePathname"
```

---

### Task 6: Create app/page.jsx (Index route)

**Files:**
- Create: `app/page.jsx`

- [ ] **Step 1: Copy Index.jsx to app/page.jsx**

```bash
cp src/pages/Index.jsx app/page.jsx
```

- [ ] **Step 2: Add 'use client' as the very first line of app/page.jsx**

Insert at line 1:
```js
'use client';
```

- [ ] **Step 3: Replace the react-router-dom import**

Current:
```js
import { Link } from 'react-router-dom';
```

Replace with:
```js
import Link from 'next/link';
```

- [ ] **Step 4: Remove the CSS import (CSS is now loaded globally from layout.jsx)**

Remove this line:
```js
import '../styles/index.css';
```

- [ ] **Step 5: Replace all `to=` props with `href=` on Link elements**

Search the file for `<Link to=` and replace each with `<Link href=`. There are typically 2–4 occurrences. Run:

```bash
sed -i '' 's/<Link to=/<Link href=/g' app/page.jsx
```

- [ ] **Step 6: Fix the component import path for HeroVideoLoop**

`HeroVideoLoop` is imported from `'../components/HeroVideoLoop'`. From `app/page.jsx` the path is now `'../src/components/HeroVideoLoop'`. Update:

Current:
```js
import HeroVideoLoop from '../components/HeroVideoLoop';
```

Replace with:
```js
import HeroVideoLoop from '../src/components/HeroVideoLoop';
```

- [ ] **Step 7: Commit**

```bash
git add app/page.jsx
git commit -m "feat: add app/page.jsx (index route) for next.js app router"
```

---

### Task 7: Create app/intake/page.jsx

**Files:**
- Create: `app/intake/page.jsx`

- [ ] **Step 1: Copy Intake.jsx**

```bash
mkdir -p app/intake
cp src/pages/Intake.jsx app/intake/page.jsx
```

- [ ] **Step 2: Add 'use client' as line 1**

Insert at line 1:
```js
'use client';
```

- [ ] **Step 3: Replace useNavigate import with useRouter**

Current:
```js
import { useNavigate } from 'react-router-dom';
```

Replace with:
```js
import { useRouter } from 'next/navigation';
```

- [ ] **Step 4: Remove the CSS import**

Remove:
```js
import '../styles/intake.css';
```

- [ ] **Step 5: Replace useNavigate usage with useRouter**

Current (line ~83):
```js
const navigate = useNavigate();
```

Replace with:
```js
const router = useRouter();
```

- [ ] **Step 6: Replace navigate() call with router.push()**

Current (line ~132):
```js
navigate('/report');
```

Replace with:
```js
router.push('/report');
```

- [ ] **Step 7: Fix the dependency array reference**

Current (line ~136):
```js
}, [navigate]);
```

Replace with:
```js
}, [router]);
```

- [ ] **Step 8: Commit**

```bash
git add app/intake/page.jsx
git commit -m "feat: add app/intake/page.jsx for next.js app router"
```

---

### Task 8: Create app/report/page.jsx

**Files:**
- Create: `app/report/page.jsx`

- [ ] **Step 1: Copy Report.jsx**

```bash
mkdir -p app/report
cp src/pages/Report.jsx app/report/page.jsx
```

- [ ] **Step 2: Add 'use client' as line 1**

Insert at line 1:
```js
'use client';
```

- [ ] **Step 3: Replace the react-router-dom import**

Current:
```js
import { Link } from 'react-router-dom';
```

Replace with:
```js
import Link from 'next/link';
```

- [ ] **Step 4: Remove the CSS import**

Remove:
```js
import '../styles/report.css';
```

- [ ] **Step 5: Replace all `to=` Link props with `href=`**

```bash
sed -i '' 's/<Link to=/<Link href=/g' app/report/page.jsx
```

- [ ] **Step 6: Commit**

```bash
git add app/report/page.jsx
git commit -m "feat: add app/report/page.jsx for next.js app router"
```

---

### Task 9: Create app/modules/page.jsx

**Files:**
- Create: `app/modules/page.jsx`

- [ ] **Step 1: Copy Modules.jsx**

```bash
mkdir -p app/modules
cp src/pages/Modules.jsx app/modules/page.jsx
```

- [ ] **Step 2: Add 'use client' as line 1**

Insert at line 1:
```js
'use client';
```

- [ ] **Step 3: Replace the react-router-dom import**

Current:
```js
import { Link } from 'react-router-dom';
```

Replace with:
```js
import Link from 'next/link';
```

- [ ] **Step 4: Remove the CSS import**

Remove:
```js
import '../styles/modules.css';
```

- [ ] **Step 5: Replace all `to=` Link props with `href=`**

```bash
sed -i '' 's/<Link to=/<Link href=/g' app/modules/page.jsx
```

- [ ] **Step 6: Commit**

```bash
git add app/modules/page.jsx
git commit -m "feat: add app/modules/page.jsx for next.js app router"
```

---

### Task 10: Create app/ipo/page.jsx

**Files:**
- Create: `app/ipo/page.jsx`

- [ ] **Step 1: Copy Ipo.jsx**

```bash
mkdir -p app/ipo
cp src/pages/Ipo.jsx app/ipo/page.jsx
```

- [ ] **Step 2: Add 'use client' as line 1**

Insert at line 1:
```js
'use client';
```

- [ ] **Step 3: Remove the CSS import**

Remove:
```js
import '../styles/ipo.css';
```

Ipo.jsx has no `react-router-dom` import (it uses no Link or navigation), so no further import changes are needed.

- [ ] **Step 4: Commit**

```bash
git add app/ipo/page.jsx
git commit -m "feat: add app/ipo/page.jsx for next.js app router"
```

---

### Task 11: Update Header.test.jsx — swap MemoryRouter for next/navigation mock

**Files:**
- Modify: `src/components/Header.test.jsx`

- [ ] **Step 1: Run tests to see current state**

```bash
npm test
```

Note the current pass/fail state before changing anything.

- [ ] **Step 2: Replace the test file content**

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import i18n from '../i18n';
import Header from './Header';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('next/link', () => ({
  default: ({ href, children, className }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

function renderHeader() {
  return render(
    <I18nextProvider i18n={i18n}>
      <Header mobileNavOpen={false} onHamburgerClick={() => {}} />
    </I18nextProvider>
  );
}

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh');
  });

  it('renders all 5 nav links', () => {
    renderHeader();
    expect(screen.getByText('概览')).toBeInTheDocument();
    expect(screen.getByText('数据采集')).toBeInTheDocument();
    expect(screen.getByText('诊断报告')).toBeInTheDocument();
    expect(screen.getByText('执行模块')).toBeInTheDocument();
    expect(screen.getByText('IPO就绪')).toBeInTheDocument();
  });

  it('renders language toggle button showing EN when language is zh', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /switch language/i })).toHaveTextContent('EN');
  });

  it('switches to en when toggle is clicked', async () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: /switch language/i });
    fireEvent.click(toggle);
    expect(i18n.language).toBe('en');
  });
});
```

- [ ] **Step 3: Run tests and verify all pass**

```bash
npm test
```

Expected: 3 Header tests pass + 4 i18n tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.test.jsx
git commit -m "test: update Header.test.jsx for next/navigation and next/link mocks"
```

---

### Task 12: Boot the Next.js dev server and verify all routes

**Files:** None — verification only.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected output includes `▲ Next.js 15.x.x` and `Local: http://localhost:3000`.

- [ ] **Step 2: Visit each route and confirm it renders**

Open a browser and check:
- `http://localhost:3000/` — landing page (dark theme, hero animation)
- `http://localhost:3000/intake` — intake form (light theme)
- `http://localhost:3000/report` — diagnostic report (light theme)
- `http://localhost:3000/modules` — module cards (light theme)
- `http://localhost:3000/ipo` — IPO console (light theme)

For each page: confirm the page renders, Header and MobileNav appear, language toggle works, and no console errors appear.

- [ ] **Step 3: Stop the dev server (Ctrl+C)**

---

### Task 13: Delete old Vite entry files and src/pages

**Files:**
- Delete: `src/main.jsx`
- Delete: `src/App.jsx`
- Delete: `vite.config.js`
- Delete: `index.html`
- Delete: `src/pages/Index.jsx`
- Delete: `src/pages/Intake.jsx`
- Delete: `src/pages/Report.jsx`
- Delete: `src/pages/Modules.jsx`
- Delete: `src/pages/Ipo.jsx`

- [ ] **Step 1: Delete old Vite entry files**

```bash
git rm src/main.jsx src/App.jsx vite.config.js index.html
```

- [ ] **Step 2: Delete old src/pages directory**

`src/pages/` must be removed because Next.js will attempt to use it as a Pages Router alongside the App Router, causing a conflict.

```bash
git rm src/pages/Index.jsx src/pages/Intake.jsx src/pages/Report.jsx src/pages/Modules.jsx src/pages/Ipo.jsx
rmdir src/pages
```

- [ ] **Step 3: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests still pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove vite entry files and old src/pages (superseded by app/ router)"
```

---

### Task 14: Update ARCHITECTURE.md

**Files:**
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Update Section 2 — Tech Stack table**

Replace:
```
| Build tool    | Vite 8                                      |
| Routing       | React Router 7 (`BrowserRouter`)            |
```

With:
```
| Build tool    | Next.js 15 (App Router)                     |
| Routing       | Next.js App Router (file-based)             |
```

Also update the Deployment row:
```
| Deployment    | Vercel (Next.js — App Router)               |
```

- [ ] **Step 2: Update Section 3 — Directory Structure**

Replace the entire code block with:

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

- [ ] **Step 3: Update Section 4 — Routing**

Replace opening paragraph:
```
All routes are client-side. Vercel rewrites `/*` → `index.html`.
```
With:
```
All routes use Next.js App Router file-based routing. Each route is an `app/*/page.jsx` file.
```

Update the Notes column for Header/MobileNav row at the bottom:
```
`Header` and `MobileNav` are rendered in `app/layout.jsx` via `NavWrapper` and appear on every page.
```

- [ ] **Step 4: Update Section 7 — Component Inventory**

Update the Notes column for Header:
```
Sticky; active route highlighted via `usePathname` from next/navigation
```

- [ ] **Step 5: Update Section 11 — Deployment**

Replace:
```
- Config: `vercel.json` rewrites all routes to `/index.html` for SPA routing
```
With:
```
- Config: `vercel.json` sets `buildCommand: next build` and `outputDirectory: .next`; no rewrites needed
```

- [ ] **Step 6: Run tests one final time**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs: update ARCHITECTURE.md for next.js app router migration"
```
