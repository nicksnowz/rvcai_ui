# Hero Video-Loop Backdrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port RVC-web's crossfading 5-clip hero video loop into rvcai_ui as a dimmed full-bleed backdrop behind a single-column hero, and relocate the AI-engine SVG card to its own block directly below the hero — without breaking any existing hero functionality.

**Architecture:** A new self-contained `HeroVideoLoop` React component owns the dual-layer A/B crossfade (ported verbatim from RVC-web). `Index.jsx` renders it as the first child of `.hero`, collapses the hero to one column, and moves the engine SVG out into a sibling `.engine-section`. All styling lives in `src/styles/index.css`. The engine counters resolve by `id` at the document level, so the SVG keeps working after the DOM move.

**Tech Stack:** React 19, Vite 8, react-router-dom 7, react-i18next, Vitest 4 + @testing-library/react (jsdom).

**Reference spec:** `docs/superpowers/specs/2026-05-31-hero-video-loop-bg-design.md`

---

## Workspace setup (before Task 1)

This work must land on an **isolated branch/worktree off the current `causally-dev` HEAD** so the unrelated uncommitted changes already in the tree (Header/MobileNav/Intake/Ipo/Modules/Report.jsx, locales, rvc-base.css, package-lock.json) stay undisturbed. The executing skill (subagent-driven-development) invokes `superpowers:using-git-worktrees` to create this. Do **not** stage or commit any file outside the ones named in each task. Never use `git add -A` / `git add .`.

All commands below assume the working directory is the rvcai_ui project root (the worktree).

---

## Task 1: Copy video assets into `public/`

**Files:**
- Create (copy): `public/workflow.mp4`, `public/data-center.mp4`, `public/meeting.mp4`, `public/ship.mp4`, `public/stock-market.mp4`, `public/hero-poster.jpg`

Source is the sibling repo at `/Users/mac/code/RVC/RVC-web/public/`. Vite serves `public/` at the site root, so these resolve as `/workflow.mp4` … `/hero-poster.jpg`. None match the `.gitignore`/`.vercelignore` `image*` pattern, so they commit and deploy normally.

- [ ] **Step 1: Copy the six asset files**

```bash
cp /Users/mac/code/RVC/RVC-web/public/workflow.mp4 \
   /Users/mac/code/RVC/RVC-web/public/data-center.mp4 \
   /Users/mac/code/RVC/RVC-web/public/meeting.mp4 \
   /Users/mac/code/RVC/RVC-web/public/ship.mp4 \
   /Users/mac/code/RVC/RVC-web/public/stock-market.mp4 \
   /Users/mac/code/RVC/RVC-web/public/hero-poster.jpg \
   public/
```

- [ ] **Step 2: Verify all six landed**

Run: `ls -1 public/ | sort`
Expected output includes: `data-center.mp4`, `hero-poster.jpg`, `icons.svg`, `logo.svg`, `meeting.mp4`, `ship.mp4`, `stock-market.mp4`, `workflow.mp4`

- [ ] **Step 3: Verify they are not ignored**

Run: `git check-ignore public/workflow.mp4 public/hero-poster.jpg; echo "exit=$?"`
Expected: no paths printed and `exit=1` (meaning git does NOT ignore them).

- [ ] **Step 4: Commit**

```bash
git add public/workflow.mp4 public/data-center.mp4 public/meeting.mp4 public/ship.mp4 public/stock-market.mp4 public/hero-poster.jpg
git commit -m "feat: add hero video-loop clips and poster to public/"
```

---

## Task 2: `HeroVideoLoop` component (the crossfade engine)

**Files:**
- Create: `src/components/HeroVideoLoop.jsx`
- Test: `src/components/HeroVideoLoop.test.jsx`

Faithful port of RVC-web's dual-layer crossfade. The only deviation from the source is using optional chaining on `play()` (`?.catch`) so it is safe under jsdom, where `HTMLMediaElement.prototype.play` is not implemented and returns `undefined`. This is harmless in real browsers (where `play()` returns a Promise).

- [ ] **Step 1: Write the failing test**

Vitest globals are enabled (no need to import `describe`/`it`/`expect`). Videos carry `aria-hidden`, so query via the container rather than by role.

```jsx
// src/components/HeroVideoLoop.test.jsx
import { render } from '@testing-library/react';
import HeroVideoLoop from './HeroVideoLoop';

describe('HeroVideoLoop', () => {
  it('renders two video layers seeded with the first two clips', () => {
    const { container } = render(<HeroVideoLoop />);
    const videos = container.querySelectorAll('video');
    expect(videos).toHaveLength(2);
    expect(videos[0]).toHaveAttribute('src', '/workflow.mp4');
    expect(videos[1]).toHaveAttribute('src', '/data-center.mp4');
  });

  it('gives every layer the shared poster and eager preload', () => {
    const { container } = render(<HeroVideoLoop />);
    container.querySelectorAll('video').forEach((v) => {
      expect(v).toHaveAttribute('poster', '/hero-poster.jpg');
      expect(v).toHaveAttribute('preload', 'auto');
      expect(v).toHaveAttribute('playsinline');
    });
  });

  it('renders the legibility scrim overlay', () => {
    const { container } = render(<HeroVideoLoop />);
    expect(container.querySelector('.hero-video-scrim')).toBeInTheDocument();
  });

  it('marks the second layer hidden at rest (layer A active)', () => {
    const { container } = render(<HeroVideoLoop />);
    const videos = container.querySelectorAll('video');
    expect(videos[0].className).not.toContain('hero-video--hidden');
    expect(videos[1].className).toContain('hero-video--hidden');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/HeroVideoLoop.test.jsx`
Expected: FAIL — `Failed to resolve import './HeroVideoLoop'` (module does not exist yet).

- [ ] **Step 3: Write the component**

```jsx
// src/components/HeroVideoLoop.jsx
import { useEffect, useRef, useState } from 'react';

const VIDEO_SEQUENCE = [
  '/workflow.mp4',
  '/data-center.mp4',
  '/meeting.mp4',
  '/ship.mp4',
  '/stock-market.mp4',
];
const LAST_VIDEO_IDX = VIDEO_SEQUENCE.length - 1;
const CROSSFADE_MS = 300;

export default function HeroVideoLoop() {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [videoLayerAIdx, setVideoLayerAIdx] = useState(0);
  const [videoLayerBIdx, setVideoLayerBIdx] = useState(Math.min(1, LAST_VIDEO_IDX));
  const [activeVideoLayer, setActiveVideoLayer] = useState('A');

  // Reload a layer when its source index changes so the new clip is fetched.
  useEffect(() => { videoRefA.current?.load(); }, [videoLayerAIdx]);
  useEffect(() => { videoRefB.current?.load(); }, [videoLayerBIdx]);

  // Kick off playback of the initial active layer on mount.
  useEffect(() => { videoRefA.current?.play()?.catch(() => {}); }, []);

  const advanceVideo = (fromLayer) => {
    if (fromLayer !== activeVideoLayer) return;

    const next = fromLayer === 'A' ? 'B' : 'A';
    setActiveVideoLayer(next);

    const nextRef = next === 'A' ? videoRefA.current : videoRefB.current;
    if (nextRef) {
      nextRef.currentTime = 0;
      nextRef.play()?.catch(() => {});
    }

    const nextActiveIdx = next === 'A' ? videoLayerAIdx : videoLayerBIdx;
    const nextNextIdx = (nextActiveIdx + 1) % VIDEO_SEQUENCE.length;
    setTimeout(() => {
      if (fromLayer === 'A') setVideoLayerAIdx(nextNextIdx);
      else setVideoLayerBIdx(nextNextIdx);
    }, CROSSFADE_MS + 60);
  };

  return (
    <>
      <video
        ref={videoRefA}
        className={`hero-video ${activeVideoLayer === 'A' ? '' : 'hero-video--hidden'}`}
        src={VIDEO_SEQUENCE[videoLayerAIdx]}
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        onEnded={() => advanceVideo('A')}
        onError={() => advanceVideo('A')}
        aria-hidden="true"
      />
      <video
        ref={videoRefB}
        className={`hero-video ${activeVideoLayer === 'B' ? '' : 'hero-video--hidden'}`}
        src={VIDEO_SEQUENCE[videoLayerBIdx]}
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        onEnded={() => advanceVideo('B')}
        onError={() => advanceVideo('B')}
        aria-hidden="true"
      />
      <div className="hero-video-scrim" aria-hidden="true" />
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/HeroVideoLoop.test.jsx`
Expected: PASS — 4 passing. (jsdom may log "Not implemented: HTMLMediaElement.prototype.play" to the virtual console; this is expected noise, not a failure.)

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroVideoLoop.jsx src/components/HeroVideoLoop.test.jsx
git commit -m "feat: add HeroVideoLoop crossfade backdrop component"
```

---

## Task 3: Wire backdrop into `Index.jsx` and relocate the engine card

**Files:**
- Modify: `src/pages/Index.jsx` (add import; insert `<HeroVideoLoop />`; move `.engine-wrap` block out of the hero into a new `.engine-section`)
- Test: `src/pages/Index.test.jsx` (new)

No changes to any of Index.jsx's four `useEffect` hooks, i18n keys, CTAs, or the engine SVG markup (ids/classes/animations stay byte-stable). This task is purely structural: render the backdrop and relocate the SVG.

- [ ] **Step 1: Write the failing structural test**

Index uses `IntersectionObserver` (not in jsdom) and `react-router` `Link` + `useTranslation`, so stub IO and wrap in providers. The test asserts the relocation contract: the hero contains the typewriter headline and a `<video>`, and the engine SVG (`#n1`) now lives in `.engine-section`, **not** inside `.hero`.

```jsx
// src/pages/Index.test.jsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Index from './Index';

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function renderIndex() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('Index hero with video backdrop', () => {
  it('renders the video backdrop and typewriter headline inside the hero', () => {
    const { container } = renderIndex();
    const hero = container.querySelector('section.hero');
    expect(hero).toBeInTheDocument();
    expect(hero.querySelector('.hero-h')).toBeInTheDocument();
    expect(hero.querySelector('video')).toBeInTheDocument();
  });

  it('relocates the engine SVG into its own section below the hero', () => {
    const { container } = renderIndex();
    const hero = container.querySelector('section.hero');
    const engineSection = container.querySelector('section.engine-section');
    expect(engineSection).toBeInTheDocument();
    expect(engineSection.querySelector('#n1')).toBeInTheDocument();
    // Engine viz must NO LONGER be inside the hero.
    expect(hero.querySelector('#n1')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/pages/Index.test.jsx`
Expected: FAIL — `section.engine-section` is null (no relocation yet) and/or `hero.querySelector('video')` is null (no backdrop yet).

- [ ] **Step 3: Add the import**

At the top of `src/pages/Index.jsx`, add the import after the existing `import '../styles/index.css';` line (line 4):

```jsx
import HeroVideoLoop from '../components/HeroVideoLoop';
```

- [ ] **Step 4: Insert the backdrop as the hero's first child**

In `src/pages/Index.jsx`, the hero currently opens (around line 153):

```jsx
      <section className="hero">
        <div className="wrap">
```

Change it to render the backdrop first:

```jsx
      <section className="hero">
        <HeroVideoLoop />
        <div className="wrap">
```

- [ ] **Step 5: Move the engine card out of the hero into a new section**

In the hero's `.hero-grid`, the left content is the first child `<div>` (currently lines ~156–172) and the engine viz is the second child `<div className="engine-wrap">…</div>` (currently lines ~173–385, the full `<svg viewBox="0 0 670 520">`).

Cut the **entire** `<div className="engine-wrap">…</div>` element verbatim out of `.hero-grid`, then insert it, unchanged, inside a new `<section className="engine-section">` placed immediately after the hero's closing `</section>` and before `<section className="process">`. The result is:

```jsx
      <section className="hero">
        <HeroVideoLoop />
        <div className="wrap">
          <div className="hero-grid">
            <div>
              {/* ...unchanged left column: eyebrow, .hero-h, .hero-p, .hero-btns, .hero-trust... */}
            </div>
          </div>
        </div>
      </section>

      <section className="engine-section">
        <div className="wrap">
          <div className="engine-wrap">
            {/* ...unchanged engine <svg> with ids n1..n4, svgScore and svg-* classes... */}
          </div>
        </div>
      </section>

      <section className="process">
```

(The `.hero-grid` wrapper stays in place around the single remaining left column; Task 4 restyles it to one column.)

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- src/pages/Index.test.jsx`
Expected: PASS — 2 passing.

- [ ] **Step 7: Run the full test suite (no regressions)**

Run: `npm test`
Expected: PASS — all suites green (Header, i18n, HeroVideoLoop, Index).

- [ ] **Step 8: Commit**

```bash
git add src/pages/Index.jsx src/pages/Index.test.jsx
git commit -m "feat: render hero video backdrop and relocate engine card below hero"
```

---

## Task 4: Style the hero stage, backdrop, scrim, and relocated engine section

**Files:**
- Modify: `src/styles/index.css` (hero positioning + single column; new `.hero-video*` + `.hero-video-scrim`; new `.engine-section`; reduced-motion; mobile block)

CSS has no unit test; correctness is verified by a clean `npm run build` here and the visual pass in Task 5.

- [ ] **Step 1: Make the hero a positioned, single-column stage**

In `src/styles/index.css`, replace the first two lines (currently):

```css
.hero{padding:80px 0 64px;}
.hero-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:64px;align-items:center;}
```

with:

```css
.hero{
  position:relative;overflow:hidden;
  padding:80px 0 64px;
  min-height:clamp(440px,64vh,620px);
  display:flex;align-items:center;
}
.hero .wrap{position:relative;z-index:2;width:100%;}
.hero-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:64px;align-items:center;}
.hero-grid>div{max-width:680px;}
```

- [ ] **Step 2: Add the backdrop video + scrim layers**

Immediately after the `.hero-grid>div{max-width:680px;}` line added above, insert:

```css
/* Hero video-loop backdrop (ported from RVC-web Monolith Title-Card) */
.hero-video{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;z-index:0;pointer-events:none;
  opacity:.26;transition:opacity .3s ease;
}
.hero-video--hidden{opacity:0;}
.hero-video-scrim{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    radial-gradient(ellipse at 30% 50%, transparent 12%, rgba(8,9,12,.55) 64%, var(--bg) 96%),
    linear-gradient(90deg, rgba(8,9,12,.78) 0%, rgba(8,9,12,.45) 42%, transparent 78%),
    linear-gradient(180deg, rgba(8,9,12,.5) 0%, transparent 22%, transparent 72%, rgba(8,9,12,.62) 100%);
}
```

- [ ] **Step 3: Style the relocated engine section**

The engine card now lives in `.engine-section`. Add a rule right before the `/* Process */` comment (currently line 73). Find:

```css
.engine-card svg{max-width:100%;height:auto;}

/* Process */
```

Replace with:

```css
.engine-card svg{max-width:100%;height:auto;}

/* Engine card, relocated to its own block below the hero (final treatment deferred) */
.engine-section{padding:48px 0;}
.engine-section .engine-wrap{max-width:760px;margin:0 auto;}

/* Process */
```

- [ ] **Step 4: Add reduced-motion fallback**

Append to the end of `src/styles/index.css` (new lines after the final existing rule):

```css
@media (prefers-reduced-motion: reduce){
  .hero-video{display:none;}
  .hero{
    background:
      linear-gradient(rgba(8,9,12,.74), rgba(8,9,12,.74)),
      url('/hero-poster.jpg') center/cover no-repeat,
      var(--bg);
  }
}
```

- [ ] **Step 5: Fix the mobile block for the relocated card**

In the `@media(max-width:768px)` block, the engine card is no longer in the hero grid. Replace this line (currently line 186):

```css
  .engine-wrap{order:0;min-width:0;width:calc(100vw - 40px);overflow:hidden;}
```

with:

```css
  .engine-section{padding:32px 0;}
  .engine-section .engine-wrap{min-width:0;width:100%;max-width:100%;overflow:hidden;}
```

(Leave the following `.engine-card{…}` and `.engine-card svg{…}` mobile rules unchanged — they still apply to the relocated card.)

- [ ] **Step 6: Verify the production build compiles**

Run: `npm run build`
Expected: build completes with no CSS/JS errors and emits `dist/` (the `dist/assets/*.css` will inline the new rules).

- [ ] **Step 7: Commit**

```bash
git add src/styles/index.css
git commit -m "feat: style hero video backdrop, scrim, and relocated engine section"
```

---

## Task 5: Final verification (tests, build, visual, functionality)

**Files:** none (verification only).

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: PASS — all suites green.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: success, no errors/warnings about missing assets.

- [ ] **Step 3: Start the dev server for visual checks**

Run (background): `npm run dev`
Note the printed local URL (default `http://localhost:5173`).

- [ ] **Step 4: Desktop visual pass (≈1280px wide)**

Open the index route. Confirm:
- Video loop plays as a **dimmed** full-bleed backdrop behind the hero; headline/paragraph/CTAs stay clearly legible over it (scrim working).
- Typewriter headline (`.hero-h`) types/deletes as before.
- After a clip ends (~a few seconds), it **crossfades** to the next clip (no hard cut, no black flash).
- The AI-engine SVG card now sits in its **own block directly below the hero** (centered, ≤760px), and its counters (`n1..n4`, `svgScore`) still animate when the typewriter starts a word (the `rvc:wordstart` wiring).
- KPI strip counts up; reveal animations and marquees behave as before.

- [ ] **Step 5: Mobile visual pass (≈390px wide)**

Resize to ~390px. Confirm: single-column hero with video backdrop + legible text, no horizontal overflow, the engine card sits full-width in its section below, SVG scales within the viewport.

- [ ] **Step 6: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion"). Reload. Confirm: no video plays; the hero shows the **dimmed static poster** background instead of flat black; text remains legible.

- [ ] **Step 7: Stop the dev server**

Stop the background `npm run dev` process.

- [ ] **Step 8: Confirm no stray files staged**

Run: `git status -s`
Expected: only the files this feature added/edited are committed across Tasks 1–4; the unrelated pre-existing modifications (Header/MobileNav/Intake/Ipo/Modules/Report.jsx, locales, rvc-base.css, package-lock.json) remain **unstaged and unchanged**. If any unrelated file got staged, unstage it (`git restore --staged <file>`).

This task has no commit (verification only). After it passes, use `superpowers:finishing-a-development-branch` to integrate.

---

## Notes for the executor

- **Do not** edit any of Index.jsx's `useEffect` logic, the engine SVG internals, i18n keys, or content copy.
- **Do not** `git add -A`/`git add .`; stage only the files named per task.
- The engine counters work after relocation because they resolve targets via `document.getElementById` on the `rvc:wordstart` event — verified structurally in Task 3 and visually in Task 5.
- Scrim opacity (`.26`) and `min-height` are tuned for legibility; if text contrast looks weak during Task 5, nudge `.hero-video` opacity down or strengthen the `.hero-video-scrim` left gradient — these are the only safe knobs.
