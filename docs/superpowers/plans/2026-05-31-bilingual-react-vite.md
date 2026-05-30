# Bilingual React+Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the 5-page static HTML site to a React+Vite SPA with full EN/ZH bilingual support via react-i18next.

**Architecture:** Each HTML page becomes a React route component. A shared `Header` and `MobileNav` replace the copy-pasted nav blocks. `react-i18next` drives all string translations with locale files at `src/locales/{en,zh}.json`. Language choice persists to `localStorage`.

**Tech Stack:** Vite 5, React 18, react-router-dom v6, react-i18next, i18next, Vitest, @testing-library/react

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `vite.config.js` | Vite config with test setup |
| Create | `src/main.jsx` | Entry — i18n init + React render |
| Create | `src/App.jsx` | BrowserRouter + 5 routes |
| Create | `src/i18n.js` | i18next initialisation, localStorage persistence |
| Create | `src/locales/zh.json` | All Chinese UI strings |
| Create | `src/locales/en.json` | All English UI strings |
| Create | `src/components/Header.jsx` | Shared nav + language toggle |
| Create | `src/components/MobileNav.jsx` | Mobile nav drawer |
| Create | `src/pages/Index.jsx` | Home page with typewriter + animations |
| Create | `src/pages/Intake.jsx` | Data intake form page |
| Create | `src/pages/Report.jsx` | Diagnostic report page |
| Create | `src/pages/Modules.jsx` | Execution modules page |
| Create | `src/pages/Ipo.jsx` | IPO readiness page |
| Move | `src/styles/rvc-base.css` | Shared base styles (from root) |
| Create | `src/styles/index.css` | index.html inline styles extracted |
| Create | `src/styles/intake.css` | intake.html inline styles extracted |
| Create | `src/styles/report.css` | report.html inline styles extracted |
| Create | `src/styles/modules.css` | modules.html inline styles extracted |
| Create | `src/styles/ipo.css` | ipo.html inline styles extracted |
| Create | `src/components/Header.test.jsx` | Header + language toggle tests |
| Create | `src/i18n.test.js` | i18n init + persistence tests |
| Modify | `vercel.json` | SPA fallback rewrite |
| Modify | `index.html` | Vite entry (minimal, just mounts `<div id="root">`) |

---

## Task 1: Scaffold Vite+React Project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Initialise dependencies**

Run from the repo root:
```bash
npm create vite@latest . -- --template react --force
npm install react-router-dom react-i18next i18next
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Replace `vite.config.js`**

```js
import { defineConfig } from 'vite';
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

- [ ] **Step 3: Create `src/test-setup.js`**

```js
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Replace `index.html`** (Vite entry — minimal)

```html
<!DOCTYPE html>
<html lang="zh-CN" id="html-root">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RVC Capital — 企业价值智能诊断平台</title>
    <meta name="description" content="RVC智能诊断引擎扫描300+价值维度，72小时生成机构级洞察报告，加速您的IPO、并购与融资路径。">
    <link rel="icon" href="/logo.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Spectral:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `src/main.jsx`** (placeholder — will expand after i18n task)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Create `src/App.jsx`** (placeholder routes — pages stubbed)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Stub({ name }) {
  return <div style={{ color: '#fff', padding: 40 }}>{name} — coming soon</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stub name="Index" />} />
        <Route path="/intake" element={<Stub name="Intake" />} />
        <Route path="/report" element={<Stub name="Report" />} />
        <Route path="/modules" element={<Stub name="Modules" />} />
        <Route path="/ipo" element={<Stub name="Ipo" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Server at `http://localhost:5173`, page shows "Index — coming soon" text.

- [ ] **Step 8: Move `logo.svg` to `public/`**

```bash
cp logo.svg public/logo.svg
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold vite+react project"
```

---

## Task 2: Migrate CSS

**Files:**
- Create: `src/styles/rvc-base.css` (copy of root `rvc-base.css`)
- Create: `src/styles/index.css`, `src/styles/intake.css`, `src/styles/report.css`, `src/styles/modules.css`, `src/styles/ipo.css`

- [ ] **Step 1: Copy base CSS into src**

```bash
cp rvc-base.css src/styles/rvc-base.css
```

- [ ] **Step 2: Extract `index.html` inline styles**

Open `index.html` (the old static file, not the new Vite entry). Copy everything between line 20 `<style>` and line 216 `</style>` (exclusive of the tags themselves) into `src/styles/index.css`.

- [ ] **Step 3: Extract `intake.html` inline styles**

Copy lines 12–131 (between `<style>` and `</style>`) of `intake.html` into `src/styles/intake.css`.

- [ ] **Step 4: Extract `report.html` inline styles**

Copy lines 12–129 of `report.html` into `src/styles/report.css`.

- [ ] **Step 5: Extract `modules.html` inline styles**

Copy lines 12–219 of `modules.html` into `src/styles/modules.css`.

- [ ] **Step 6: Extract `ipo.html` inline styles**

Copy lines 12–248 of `ipo.html` into `src/styles/ipo.css`.

- [ ] **Step 7: Import base CSS in `src/main.jsx`**

Add at the top of `src/main.jsx`:
```jsx
import './styles/rvc-base.css';
```

- [ ] **Step 8: Verify — dev server still starts without CSS errors**

```bash
npm run dev
```
Expected: No console errors about missing stylesheets.

- [ ] **Step 9: Commit**

```bash
git add src/styles/ src/main.jsx
git commit -m "feat: migrate CSS to src/styles"
```

---

## Task 3: Set Up i18n

**Files:**
- Create: `src/i18n.js`
- Create: `src/locales/zh.json`
- Create: `src/locales/en.json`
- Create: `src/i18n.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/i18n.test.js`:
```js
import i18n from './i18n';

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initialises with zh as default language', () => {
    expect(i18n.language).toBe('zh');
  });

  it('changes language to en', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
  });

  it('translates a nav key in zh', () => {
    i18n.changeLanguage('zh');
    expect(i18n.t('nav.overview')).toBe('概览');
  });

  it('translates a nav key in en', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.overview')).toBe('Overview');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/i18n.test.js
```
Expected: FAIL — `./i18n` not found.

- [ ] **Step 3: Create `src/locales/zh.json`** (nav keys only for now — full strings added in Task 11)

```json
{
  "nav": {
    "overview": "概览",
    "intake": "数据采集",
    "report": "诊断报告",
    "modules": "执行模块",
    "ipo": "IPO就绪",
    "login": "登录",
    "startDiagnosis": "开始诊断 →"
  },
  "langToggle": "EN"
}
```

- [ ] **Step 4: Create `src/locales/en.json`**

```json
{
  "nav": {
    "overview": "Overview",
    "intake": "Data Intake",
    "report": "Report",
    "modules": "Modules",
    "ipo": "IPO Ready",
    "login": "Login",
    "startDiagnosis": "Start Diagnosis →"
  },
  "langToggle": "中"
}
```

- [ ] **Step 5: Create `src/i18n.js`**

```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

const savedLang = localStorage.getItem('rvc-lang') || 'zh';

i18n
  .use(initReactI18next)
  .init({
    resources: { zh: { translation: zh }, en: { translation: en } },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('rvc-lang', lng);
  document.getElementById('html-root')?.setAttribute('lang', lng === 'zh' ? 'zh-CN' : 'en');
});

export default i18n;
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run src/i18n.test.js
```
Expected: 4 passing.

- [ ] **Step 7: Commit**

```bash
git add src/i18n.js src/locales/ src/i18n.test.js
git commit -m "feat: set up i18n with zh/en locale files"
```

---

## Task 4: Header and MobileNav Components

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/MobileNav.jsx`
- Create: `src/components/Header.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/Header.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Header from './Header';

function renderHeader(activePath = '/') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[activePath]}>
        <Header />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('Header', () => {
  it('renders all 5 nav links', () => {
    renderHeader();
    expect(screen.getByText('概览')).toBeInTheDocument();
    expect(screen.getByText('数据采集')).toBeInTheDocument();
    expect(screen.getByText('诊断报告')).toBeInTheDocument();
    expect(screen.getByText('执行模块')).toBeInTheDocument();
    expect(screen.getByText('IPO就绪')).toBeInTheDocument();
  });

  it('renders language toggle button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /EN|中/i })).toBeInTheDocument();
  });

  it('switches language when toggle is clicked', async () => {
    await i18n.changeLanguage('zh');
    renderHeader();
    const toggle = screen.getByRole('button', { name: 'EN' });
    fireEvent.click(toggle);
    expect(i18n.language).toBe('en');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/Header.test.jsx
```
Expected: FAIL — `./Header` not found.

- [ ] **Step 3: Create `src/components/Header.jsx`**

```jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { to: '/', key: 'nav.overview' },
  { to: '/intake', key: 'nav.intake' },
  { to: '/report', key: 'nav.report' },
  { to: '/modules', key: 'nav.modules' },
  { to: '/ipo', key: 'nav.ipo' },
];

export default function Header({ mobileNavOpen, onHamburgerClick }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  }

  return (
    <header>
      <div className="wrap hrow">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="RVC" width="72" height="27" style={{ display: 'block', borderRadius: 4 }} />
          <div className="logo-t">
            <span className="logo-n">RVC Capital</span>
            <span className="logo-s">{t('nav.logoSub')}</span>
          </div>
        </Link>
        <nav>
          {NAV_LINKS.map(({ to, key }) => (
            <Link key={to} to={to} className={pathname === to ? 'active' : ''}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="hdr-acts">
          <button className="btn-ghost">{t('nav.login')}</button>
          <Link to="/intake" className="btn-primary">{t('nav.startDiagnosis')}</Link>
          <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
            {t('langToggle')}
          </button>
        </div>
        <button
          className={`ham${mobileNavOpen ? ' open' : ''}`}
          id="ham"
          aria-label="菜单"
          onClick={onHamburgerClick}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `src/components/MobileNav.jsx`**

```jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { to: '/', key: 'nav.overview' },
  { to: '/intake', key: 'nav.intake' },
  { to: '/report', key: 'nav.report' },
  { to: '/modules', key: 'nav.modules' },
  { to: '/ipo', key: 'nav.ipo' },
];

export default function MobileNav({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
    onClose();
  }

  return (
    <div className={`mob-nav${open ? ' open' : ''}`} id="mob-nav">
      {NAV_LINKS.map(({ to, key }) => (
        <Link key={to} to={to} className={pathname === to ? 'active' : ''} onClick={onClose}>
          {t(key)}
        </Link>
      ))}
      <button className="lang-toggle" onClick={toggleLang}>
        {t('langToggle')}
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Add missing i18n keys to `src/locales/zh.json`**

Add inside the root object:
```json
"nav": {
  ...existing keys...,
  "logoSub": "企业价值诊断平台"
}
```

Add same key to `src/locales/en.json`:
```json
"nav": {
  ...existing keys...,
  "logoSub": "Enterprise Value Platform"
}
```

- [ ] **Step 6: Add lang-toggle styles to `src/styles/rvc-base.css`**

Append at the end of `src/styles/rvc-base.css`:
```css
.lang-toggle {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--t2);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color .18s, color .18s;
}
.lang-toggle:hover {
  border-color: var(--blue);
  color: var(--blue);
}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npx vitest run src/components/Header.test.jsx
```
Expected: 3 passing.

- [ ] **Step 8: Commit**

```bash
git add src/components/ src/locales/ src/styles/rvc-base.css
git commit -m "feat: add Header and MobileNav components with lang toggle"
```

---

## Task 5: App Shell and Routing

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update `src/App.jsx`** to use real Header/MobileNav and lazy-load pages

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import Index from './pages/Index';
import Intake from './pages/Intake';
import Report from './pages/Report';
import Modules from './pages/Modules';
import Ipo from './pages/Ipo';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleMobile() {
    setMobileOpen(o => !o);
  }

  return (
    <BrowserRouter>
      <Header mobileNavOpen={mobileOpen} onHamburgerClick={toggleMobile} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/report" element={<Report />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/ipo" element={<Ipo />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Create stub page components** (each as a one-liner, replaced in later tasks)

```bash
mkdir -p src/pages
for p in Index Intake Report Modules Ipo; do
  echo "export default function ${p}() { return <div style={{color:'#fff',padding:40}}>${p}</div>; }" > src/pages/${p}.jsx
done
```

- [ ] **Step 3: Verify routing works**

```bash
npm run dev
```
Open `http://localhost:5173/` — header with nav and language toggle visible. Clicking nav links changes the stub content. Language toggle switches nav text between ZH and EN.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/pages/
git commit -m "feat: wire app shell with header, mobile nav, and stub page routes"
```

---

## Task 6: Migrate Index Page

**Files:**
- Modify: `src/pages/Index.jsx`
- Modify: `src/locales/zh.json`, `src/locales/en.json`

The index page has three JS interactions to port to `useEffect`:
1. IntersectionObserver for `.reveal` scroll animations
2. KPI counter animation on `.kpi-val[data-count]`
3. Typewriter hero headline (types prefix once, then alternates 真实价值 ↔ Real Value)

- [ ] **Step 1: Replace `src/pages/Index.jsx`**

Copy all HTML between `<div class="page">` and the closing `</div>` before `<script>` in the original `index.html` (lines 252–934) and convert to JSX:
- Replace `class=` with `className=`
- Replace `href="*.html"` with React Router `<Link to="/path">` (import `Link` from `react-router-dom`)
- Replace inline `onclick="location.href='intake.html'"` with `onClick={() => navigate('/intake')}` (use `useNavigate`)
- Self-close void elements: `<br />`, `<img />`, `<input />`
- Wrap multi-line return in a fragment or single `<div className="page">`
- Add `import '../styles/index.css';` at top

Start of `src/pages/Index.jsx`:
```jsx
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/index.css';

export default function Index() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Scroll reveal
  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vis'), i * 80);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  // KPI counter animation
  useEffect(() => {
    function animCount(el) {
      const t = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', dur = 1600, s = performance.now();
      if (isNaN(t)) return;
      function step(n) { const p = Math.min((n - s) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = pre + Math.round(t * e).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    const ko = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          animCount(e.target);
          const b = e.target.closest('.kpi-item')?.querySelector('.kpi-bfill');
          if (b) setTimeout(() => b.style.width = b.dataset.w + '%', 200);
          ko.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.kpi-val[data-count]').forEach(el => ko.observe(el));
    return () => ko.disconnect();
  }, []);

  // Typewriter hero — re-runs when language changes
  useEffect(() => {
    const h1 = heroRef.current;
    if (!h1) return;
    let cancelled = false;

    const isZh = i18n.language === 'zh';
    const prefixStr = isZh
      ? [['72小时内', false], ['\n', false], ['精准解锁', true], ['\n', false], ['企业', false]]
      : [['In 72 Hours', false], ['\n', false], ['Unlock Your', true], ['\n', false], ['Company\'s', false]];
    const words = isZh ? ['真实价值'] : ['Real Value'];

    const prefix = [];
    prefixStr.forEach(([str, acc]) => [...str].forEach(c => prefix.push({ c, acc })));
    let wordIdx = 0, typed = [];

    function buildHTML() {
      let html = '', inAcc = false;
      typed.forEach(({ c, acc }) => {
        if (c === '\n') { if (inAcc) { html += '</span>'; inAcc = false; } html += '<br>'; return; }
        if (acc && !inAcc) { html += '<span class="accent">'; inAcc = true; }
        if (!acc && inAcc) { html += '</span>'; inAcc = false; }
        html += c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c;
      });
      if (inAcc) html += '</span>';
      html += '<span class="type-cursor">|</span>';
      return html;
    }

    let timer;
    function typePrefix() {
      if (cancelled) return;
      if (prefix.length === 0 || typed.length >= prefix.length) { timer = setTimeout(typeWord, 380); return; }
      typed.push(prefix[typed.length]);
      h1.innerHTML = buildHTML();
      timer = setTimeout(typePrefix, typed[typed.length - 1].c === '\n' ? 140 : 65);
    }
    function typeWord() {
      if (cancelled) return;
      document.dispatchEvent(new CustomEvent('rvc:wordstart'));
      const chars = [...words[wordIdx]].map(c => ({ c, acc: true }));
      let ci = 0;
      (function tick() {
        if (cancelled) return;
        if (ci >= chars.length) { timer = setTimeout(deleteWord, 1900); return; }
        typed.push(chars[ci++]);
        h1.innerHTML = buildHTML();
        timer = setTimeout(tick, 85);
      })();
    }
    function deleteWord() {
      if (cancelled) return;
      if (typed.length <= prefix.length) { wordIdx = (wordIdx + 1) % words.length; timer = setTimeout(typeWord, 340); return; }
      typed.pop();
      h1.innerHTML = buildHTML();
      timer = setTimeout(deleteWord, 46);
    }

    h1.innerHTML = '<span class="type-cursor">|</span>';
    timer = setTimeout(typePrefix, 320);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [i18n.language]);

  // SVG engine counter — synced to rvc:wordstart
  useEffect(() => {
    function ease(p) { return 1 - Math.pow(1 - p, 4); }
    const counters = [
      { id: 'n1', from: 38, to: 91, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n2', from: 7.2, to: 9.6, dur: 1400, fmt: v => v.toFixed(1) },
      { id: 'n3', from: 0, to: 58, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n4', from: 0, to: 34, dur: 1400, fmt: v => Math.round(v) },
      { id: 'svgScore', from: 0, to: 68, dur: 1600, fmt: v => Math.round(v) },
    ];
    counters.forEach(c => { const el = document.getElementById(c.id); if (el) el.textContent = c.fmt(c.from); });
    function runOne(c) {
      const el = document.getElementById(c.id); if (!el) return;
      const t0 = performance.now();
      (function tick(now) { const p = Math.min((now - t0) / c.dur, 1), v = c.from + (c.to - c.from) * ease(p); el.textContent = c.fmt(v); if (p < 1) requestAnimationFrame(tick); })(t0);
    }
    function runAll() { counters.forEach(runOne); }
    document.addEventListener('rvc:wordstart', runAll);
    return () => document.removeEventListener('rvc:wordstart', runAll);
  }, []);

  return (
    <div className="page">
      {/* paste JSX converted from index.html lines 252–934 here */}
      {/* Key substitutions:
          - <h1 className="hero-h"> gets ref={heroRef}
          - all href="*.html" become <Link to="/path">
          - onclick= becomes onClick=
          - class= becomes className=
          - <br> becomes <br />
          - SVG elements with camelCase attrs (strokeWidth, viewBox, etc.)
      */}
    </div>
  );
}
```

- [ ] **Step 2: Complete the JSX conversion**

Work through `index.html` lines 252–934 converting HTML to JSX. Add `ref={heroRef}` to the `<h1 className="hero-h">` element.

- [ ] **Step 3: Add Index page i18n strings to locale files**

Add all user-visible strings from the Index page to `zh.json` under an `"index"` key. Mirror all keys in `en.json` with English translations. Replace hardcoded strings in `Index.jsx` with `t('index.keyName')` calls.

Minimum keys to add (`zh.json`):
```json
"index": {
  "eyebrow": "AI驱动 · 资本智能",
  "heroBtn": "立即开始诊断",
  "heroBtn2": "查看示例报告 →",
  "trust1": "72小时交付",
  "trust2": "300+价值维度",
  "trust3": "机构级AI分析",
  "heroParagraph": "AI 驱动的企业资本化生命周期操作系统 —— 智能诊断引擎系统扫描300+价值维度，覆盖战略、财务、运营与治理等，加速企业升级与价值增长。"
}
```

`en.json` mirror:
```json
"index": {
  "eyebrow": "AI-Powered · Capital Intelligence",
  "heroBtn": "Start Diagnosis Now",
  "heroBtn2": "View Sample Report →",
  "trust1": "72-Hour Delivery",
  "trust2": "300+ Value Dimensions",
  "trust3": "Institutional-Grade AI",
  "heroParagraph": "AI-driven enterprise capitalization lifecycle OS — our intelligent diagnostic engine scans 300+ value dimensions across strategy, finance, operations, and governance to accelerate growth."
}
```

- [ ] **Step 4: Verify Index page visually**

```bash
npm run dev
```
Open `http://localhost:5173/`. Verify:
- Typewriter animation runs
- Language toggle switches hero text and nav
- Scroll animations fire on scroll
- KPI counters animate on scroll

- [ ] **Step 5: Commit**

```bash
git add src/pages/Index.jsx src/locales/
git commit -m "feat: migrate index page to React with i18n"
```

---

## Task 7: Migrate Intake Page

**Files:**
- Modify: `src/pages/Intake.jsx`
- Modify: `src/locales/zh.json`, `src/locales/en.json`

- [ ] **Step 1: Replace `src/pages/Intake.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/intake.css';

export default function Intake() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Scroll reveal
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="page">
      {/* JSX converted from intake.html — lines after </header> up to <script> */}
      {/* Step indicator clicks: replace JS querySelectorAll active toggling with setActiveStep(n) */}
    </div>
  );
}
```

- [ ] **Step 2: Complete JSX conversion** from `intake.html` — same rules as Task 6 Step 2.

- [ ] **Step 3: Add Intake i18n strings** under `"intake"` key in both locale files. Replace all hardcoded strings with `t('intake.keyName')`.

- [ ] **Step 4: Verify Intake page visually**

```bash
npm run dev
```
Open `http://localhost:5173/intake`. Verify form steps, sliders, and right-panel AI scan display correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Intake.jsx src/locales/
git commit -m "feat: migrate intake page to React with i18n"
```

---

## Task 8: Migrate Report Page

**Files:**
- Modify: `src/pages/Report.jsx`
- Modify: `src/locales/zh.json`, `src/locales/en.json`

- [ ] **Step 1: Replace `src/pages/Report.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/report.css';

export default function Report() {
  const { t } = useTranslation();
  const [activeSidebarLink, setActiveSidebarLink] = useState(0);

  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="page">
      {/* JSX converted from report.html */}
      {/* Sidebar link active state: replace JS classList toggling with activeSidebarLink state */}
    </div>
  );
}
```

- [ ] **Step 2: Complete JSX conversion** from `report.html`.

- [ ] **Step 3: Add Report i18n strings** under `"report"` key in both locale files.

- [ ] **Step 4: Verify Report page visually**

```bash
npm run dev
```
Open `http://localhost:5173/report`. Verify score cards, radar SVG, roadmap, and sidebar nav display correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Report.jsx src/locales/
git commit -m "feat: migrate report page to React with i18n"
```

---

## Task 9: Migrate Modules Page

**Files:**
- Modify: `src/pages/Modules.jsx`
- Modify: `src/locales/zh.json`, `src/locales/en.json`

- [ ] **Step 1: Replace `src/pages/Modules.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/modules.css';

export default function Modules() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="page">
      {/* JSX converted from modules.html */}
      {/* Filter clicks: replace JS active-class toggling with setActiveFilter */}
      {/* Search: replace oninput with onChange={e => setSearchQuery(e.target.value)} */}
      {/* Modal open/close: replace JS classList with setModalOpen/setModalData */}
    </div>
  );
}
```

- [ ] **Step 2: Complete JSX conversion** from `modules.html`.

- [ ] **Step 3: Add Modules i18n strings** under `"modules"` key in both locale files.

- [ ] **Step 4: Verify Modules page visually**

```bash
npm run dev
```
Open `http://localhost:5173/modules`. Verify filter tabs, search, card grid, and modal open/close work.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Modules.jsx src/locales/
git commit -m "feat: migrate modules page to React with i18n"
```

---

## Task 10: Migrate Ipo Page

**Files:**
- Modify: `src/pages/Ipo.jsx`
- Modify: `src/locales/zh.json`, `src/locales/en.json`

- [ ] **Step 1: Replace `src/pages/Ipo.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ipo.css';

export default function Ipo() {
  const { t } = useTranslation();

  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="page">
      {/* JSX converted from ipo.html */}
    </div>
  );
}
```

- [ ] **Step 2: Complete JSX conversion** from `ipo.html`.

- [ ] **Step 3: Add Ipo i18n strings** under `"ipo"` key in both locale files.

- [ ] **Step 4: Verify Ipo page visually**

```bash
npm run dev
```
Open `http://localhost:5173/ipo`. Verify maturity score, timeline, checklist, and risk panel display correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Ipo.jsx src/locales/
git commit -m "feat: migrate ipo page to React with i18n"
```

---

## Task 11: Update vercel.json for SPA

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Read current `vercel.json`**

```bash
cat vercel.json
```

- [ ] **Step 2: Replace `vercel.json`**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
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

- [ ] **Step 3: Update `vercel.json` build config** (add build command for Vite)

Add at the top level:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [...],
  "headers": [...]
}
```

- [ ] **Step 4: Verify production build**

```bash
npm run build
```
Expected: `dist/` created, no build errors.

```bash
npm run preview
```
Open `http://localhost:4173/`. Verify all 5 routes work, including direct URL access (e.g. open `http://localhost:4173/report` directly — should not 404).

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "feat: update vercel.json for vite spa deployment"
```

---

## Task 12: Final QA

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```
Expected: All tests passing.

- [ ] **Step 2: Start dev server and verify ZH language**

```bash
npm run dev
```
Check every page in ZH mode:
- [ ] `/` — typewriter, animations, KPI counters
- [ ] `/intake` — form steps, sliders, AI scan panel
- [ ] `/report` — score cards, sidebar, roadmap
- [ ] `/modules` — filters, search, modal
- [ ] `/ipo` — timeline, checklist, risk panel

- [ ] **Step 3: Switch to EN and verify all pages**

Click language toggle. Verify all strings switch on every page. Verify no layout breaks (some EN strings are longer — check for overflow at 375px mobile width).

- [ ] **Step 4: Verify language persists on refresh**

Switch to EN, refresh the page. Verify EN is still active.

- [ ] **Step 5: Mobile breakpoint check**

Open DevTools at 375px width. Check all 5 pages for:
- No horizontal overflow
- Hamburger nav opens/closes correctly
- Language toggle visible in mobile nav

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete bilingual react+vite migration"
```
