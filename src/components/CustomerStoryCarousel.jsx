'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AUTO_MS = 7000;

export default function CustomerStoryCarousel() {
  const { t } = useTranslation();
  const stories = t('index.csStories', { returnObjects: true }) || [];
  const count = stories.length;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(null);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (count <= 1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let cancelled = false;
    startRef.current = performance.now() - elapsedRef.current;

    const tick = (now) => {
      if (cancelled) return;
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const e = now - startRef.current;
      elapsedRef.current = e;
      const p = Math.min(e / AUTO_MS, 1);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (p >= 1) {
        elapsedRef.current = 0;
        startRef.current = now;
        setIdx((i) => (i + 1) % count);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, [count, paused, idx]);

  const goTo = (n) => {
    elapsedRef.current = 0;
    startRef.current = performance.now();
    if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
    setIdx(((n % count) + count) % count);
  };

  if (count === 0) return null;

  return (
    <section
      className="cstory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="cstory-stage">
          {stories.map((s, i) => {
            const state = i === idx ? 'active' : 'inactive';
            return (
              <div className="cstory-slide" data-state={state} key={i} aria-hidden={state !== 'active'}>
                <div className="cstory-grid">
                  <figure className="cstory-portrait">
                    <img src={s.image} alt="" />
                  </figure>
                  <div className="cstory-body">
                    <span className="cstory-kicker">{t('index.csKicker')}</span>
                    <blockquote className="cstory-quote">
                      <span aria-hidden className="cstory-quote-mark">&ldquo;</span>
                      {s.quote}
                      <span aria-hidden>&rdquo;</span>
                    </blockquote>
                    <figcaption className="cstory-attr">
                      <span className="cstory-name">{s.name}</span>
                    </figcaption>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cstory-ticks" role="tablist" aria-label="Customer stories">
          {stories.map((_, i) => (
            <button
              type="button"
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Story ${i + 1}`}
              className={`cstory-tick${i === idx ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="cstory-tick-bar" />
              {i === idx && (
                <span className="cstory-tick-progress" ref={progressRef} />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
