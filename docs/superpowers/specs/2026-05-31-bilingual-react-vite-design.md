# Bilingual (EN/ZH) React+Vite Migration Design

**Date:** 2026-05-31  
**Status:** Approved

## Overview

Migrate the current 5-page pure-static HTML site to a React+Vite SPA, and add full bilingual EN/ZH support via `react-i18next`. The visual design remains pixel-identical to the current dark Operational Modernism reskin. No new pages or features are added beyond language switching.

## Goals

- Replace duplicated HTML boilerplate (nav/header repeated across 5 files) with shared React components
- Add EN/ZH language toggle in the top-right header area, persisted to `localStorage`
- All UI strings externalised into `src/locales/en.json` and `src/locales/zh.json`
- Maintain existing URL structure (`/`, `/intake`, `/report`, `/modules`, `/ipo`)
- Zero visual regression from current design

## Non-Goals

- No backend, no API, no form submission logic
- No new pages or sections
- No TypeScript (stay JavaScript for now)
- No design changes beyond the language toggle UI element

## Tech Stack

| Concern | Choice |
|---|---|
| Build | Vite 5 |
| UI | React 18 |
| Routing | react-router-dom v6 |
| i18n | react-i18next + i18next |
| Styling | Existing `rvc-base.css` + per-page CSS files |
| Deploy | Vercel (unchanged) |

## Project Structure

```
rvcai_ui/
├── src/
│   ├── components/
│   │   ├── Header.jsx        ← shared nav + language toggle
│   │   └── MobileNav.jsx     ← shared mobile nav drawer
│   ├── pages/
│   │   ├── Index.jsx
│   │   ├── Intake.jsx
│   │   ├── Report.jsx
│   │   ├── Modules.jsx
│   │   └── Ipo.jsx
│   ├── locales/
│   │   ├── en.json
│   │   └── zh.json
│   ├── styles/
│   │   ├── rvc-base.css      ← moved from root, unchanged
│   │   ├── index.css
│   │   ├── intake.css
│   │   ├── report.css
│   │   ├── modules.css
│   │   └── ipo.css
│   ├── i18n.js               ← i18next initialisation
│   ├── App.jsx               ← router + routes
│   └── main.jsx              ← entry point
├── public/
│   └── logo.svg
├── index.html                ← Vite entry (replaces old index.html)
├── vite.config.js
├── package.json
└── vercel.json               ← updated for SPA fallback
```

## Routing

`react-router-dom` v6 with `<BrowserRouter>`. Routes:

| Path | Component |
|---|---|
| `/` | `Index` |
| `/intake` | `Intake` |
| `/report` | `Report` |
| `/modules` | `Modules` |
| `/ipo` | `Ipo` |

`vercel.json` updated to rewrite all paths to `/index.html` (SPA fallback), replacing the current per-page rewrites.

## i18n Architecture

`src/i18n.js` initialises i18next with:
- `lng` defaulting to `zh` (matches current site language)
- `fallbackLng: 'en'`
- Resources loaded from `src/locales/en.json` and `src/locales/zh.json`
- `localStorage` key `rvc-lang` persists user choice across sessions

Translation keys are namespaced by page/section, e.g.:
```json
{
  "nav": { "overview": "Overview", "intake": "Data Intake", ... },
  "hero": { "title": "...", "subtitle": "..." },
  "intake": { "step1Title": "...", ... }
}
```

Components use the `useTranslation` hook:
```jsx
const { t } = useTranslation();
return <h1>{t('hero.title')}</h1>;
```

## Language Toggle Component

A pill button rendered in `Header.jsx`, positioned top-right adjacent to existing nav links.

- Label: `EN` or `中` (shows the *current* language, not target)
- On click: calls `i18n.changeLanguage(newLang)` and saves to `localStorage`
- On mobile: same toggle appears inside the `MobileNav` drawer
- Styling: matches existing nav link style from `rvc-base.css`; active state uses existing `--accent` colour token

## Styling Migration

- `rvc-base.css` moves to `src/styles/rvc-base.css` and is imported in `main.jsx` — no content changes
- Each page's inline `<style>` block is extracted to a co-located CSS file in `src/styles/`
- CSS class names unchanged — no CSS Modules or Tailwind, plain CSS only
- Cache-busting query params on `rvc-base.css` are no longer needed (Vite handles asset hashing)

## Data & Interactivity

- All existing JS interactions (sliders, modals, radar chart, scroll reveal) are ported as-is into `useEffect` hooks or inline event handlers within their page component
- No state management library needed — component-local state is sufficient
- Chart.js (used in `report.html`) imported as an npm package

## Deployment

`vercel.json` simplified to a single SPA rewrite:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Cache headers for static assets handled by Vite's content-hash filenames.

## Migration Strategy

Migrate one page at a time in this order:
1. Scaffold Vite project, install deps, set up `i18n.js`, create `Header` + `MobileNav` components
2. Migrate `index.html` → `Index.jsx` (largest page, validates the pattern)
3. Migrate remaining pages: `Intake`, `Report`, `Modules`, `Ipo`
4. Extract all Chinese strings into `zh.json`, write `en.json` translations
5. Add language toggle to `Header` and `MobileNav`
6. Visual QA both languages at all breakpoints
7. Update `vercel.json`, deploy

## Acceptance Criteria

- [ ] Site renders pixel-identically to current design in both languages
- [ ] Language toggle switches all strings without page reload
- [ ] Language choice persists on refresh
- [ ] All 5 routes work with direct URL access on Vercel
- [ ] No horizontal overflow or layout breaks at mobile breakpoints in either language
- [ ] All existing JS interactions (sliders, modals, radar chart, hamburger nav) work correctly
