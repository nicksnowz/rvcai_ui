'use client';
import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import HeroVideoLoop from '../src/components/HeroVideoLoop';

export default function Index() {
  const { t, i18n } = useTranslation();
  const wordRef = useRef(null);
  const procWrapRef = useRef(null);
  const procLadderRef = useRef(null);

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

  // Scroll-driven active step for the process ladder
  useEffect(() => {
    const wrap = procWrapRef.current;
    const ladder = procLadderRef.current;
    if (!wrap || !ladder) return;
    const rungs = Array.from(ladder.children);
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.55 - rect.top) / rect.height));
      const active = Math.min(rungs.length - 1, Math.floor(p * rungs.length));
      rungs.forEach((rung, i) => {
        const state = i < active ? 'past' : i === active ? 'active' : 'future';
        if (rung.dataset.state !== state) rung.dataset.state = state;
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // KPI counter animation
  useEffect(() => {
    function animCount(el) {
      const target = +el.dataset.count;
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const dur = 1600;
      const s = performance.now();
      if (isNaN(target)) return;
      function step(n) {
        const p = Math.min((n - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * e).toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(step);
      }
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

  // Typewriter — word only
  useEffect(() => {
    const span = wordRef.current;
    if (!span) return;
    let cancelled = false;

    const words = t('index.heroWords', { returnObjects: true });
    let wordIdx = 0;

    let timer;
    function typeWord() {
      if (cancelled) return;
      document.dispatchEvent(new CustomEvent('rvc:wordstart'));
      const chars = [...words[wordIdx]];
      let ci = 0;
      span.textContent = '';
      (function tick() {
        if (cancelled) return;
        if (ci >= chars.length) { timer = setTimeout(deleteWord, 1900); return; }
        span.textContent += chars[ci++];
        timer = setTimeout(tick, 85);
      })();
    }
    function deleteWord() {
      if (cancelled) return;
      const text = span.textContent;
      if (text.length === 0) {
        wordIdx = (wordIdx + 1) % words.length;
        timer = setTimeout(typeWord, 340);
        return;
      }
      span.textContent = text.slice(0, -1);
      timer = setTimeout(deleteWord, 46);
    }

    timer = setTimeout(typeWord, 320);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [i18n.language]);

  // SVG engine counter
  useEffect(() => {
    function ease(p) { return 1 - Math.pow(1 - p, 4); }
    const counters = [
      { id: 'n1', from: 38, to: 91, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n2', from: 7.2, to: 9.6, dur: 1400, fmt: v => v.toFixed(1) },
      { id: 'n3', from: 0, to: 58, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n4', from: 0, to: 34, dur: 1400, fmt: v => Math.round(v) },
      { id: 'svgScore', from: 0, to: 68, dur: 1600, fmt: v => Math.round(v) },
    ];
    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) el.textContent = c.fmt(c.from);
    });
    function runOne(c) {
      const el = document.getElementById(c.id);
      if (!el) return;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / c.dur, 1);
        const v = c.from + (c.to - c.from) * ease(p);
        el.textContent = c.fmt(v);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    function runAll() { counters.forEach(runOne); }
    document.addEventListener('rvc:wordstart', runAll);
    return () => document.removeEventListener('rvc:wordstart', runAll);
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <HeroVideoLoop />
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <h1 className="hero-h">
                {t('index.heroPrefixLine1')}<br/>
                {t('index.heroPrefixLine2')}{' '}<span ref={wordRef} className="accent"></span><span className="type-cursor">|</span>
              </h1>
              <p className="hero-p">{t('index.heroParagraph')}</p>
              <div className="hero-btns">
                <Link href="/intake" className="btn-blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  {t('index.heroBtn')}
                </Link>
                <Link href="/report" className="btn-outline">{t('index.heroBtn2')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="engine-section">
        <div className="wrap">
          <div className="chapter-head">
            <span className="chapter-num" aria-hidden>01</span>
            <div className="chapter-head-body">
              <span className="chapter-kicker">// chapter 01 // engine</span>
              <h2 className="chapter-title">{t('index.engineTitle')}<br /><span className="chapter-accent">{t('index.engineTitleAccent')}</span></h2>
              <p className="chapter-lead">{t('index.engineLead')}</p>
            </div>
          </div>
            <div className="eng-stage">

              {/* ── Left: Analysis Inputs ── */}
              <div className="eng-panel eng-panel--in">
                <div className="eng-panel-lbl">{t('index.engineInputs')}</div>

                <div className="eng-in-card">
                  <div className="eng-in-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <div className="eng-in-body">
                    <div className="eng-in-name">{t('index.svgI1Title')}</div>
                    <div className="eng-in-sub">{t('index.svgI1Sub')}</div>
                    <div className="eng-in-tag">{t('index.svgI1Data')}</div>
                  </div>
                </div>

                <div className="eng-in-card">
                  <div className="eng-in-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div className="eng-in-body">
                    <div className="eng-in-name">{t('index.svgI2Title')}</div>
                    <div className="eng-in-sub">{t('index.svgI2Sub')}</div>
                    <div className="eng-in-tag">{t('index.svgI2Data')}</div>
                  </div>
                </div>

                <div className="eng-in-card">
                  <div className="eng-in-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M6.34 17.66l-1.41 1.41"/>
                    </svg>
                  </div>
                  <div className="eng-in-body">
                    <div className="eng-in-name">{t('index.svgI3Title')}</div>
                    <div className="eng-in-sub">{t('index.svgI3Sub')}</div>
                    <div className="eng-in-tag">{t('index.svgI3Data')}</div>
                  </div>
                </div>

                <div className="eng-in-card">
                  <div className="eng-in-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="eng-in-body">
                    <div className="eng-in-name">{t('index.svgI4Title')}</div>
                    <div className="eng-in-sub">{t('index.svgI4Sub')}</div>
                    <div className="eng-in-tag">{t('index.svgI4Data')}</div>
                  </div>
                </div>
              </div>

              {/* ── Center: AI Engine Core ── */}
              <div className="eng-core">
                <div className="eng-core-eyebrow">AI ENGINE · RVC CORE</div>
                <div className="eng-orb-wrap">
                  <div className="eng-orb-ring eng-orb-ring--3"></div>
                  <div className="eng-orb-ring eng-orb-ring--2"></div>
                  <div className="eng-orb-ring eng-orb-ring--1"></div>
                  <div className="eng-orb-nucleus">
                    <div className="eng-orb-lbl">{t('index.svgScore')}</div>
                    <div className="eng-orb-score">
                      <span id="svgScore" suppressHydrationWarning>68</span>
                      <span className="eng-orb-denom">/100</span>
                    </div>
                    <div className="eng-orb-pulse"></div>
                  </div>
                </div>
                <div className="eng-dims">300+ {t('index.engineDims')}</div>
              </div>

              {/* ── Right: Diagnostic Outputs ── */}
              <div className="eng-panel eng-panel--out">
                <div className="eng-panel-lbl">{t('index.engineOutputs')}</div>

                <div className="eng-out-card">
                  <div className="eng-out-head">
                    <span className="eng-out-title">{t('index.svgR1Title')}</span>
                    <span className="eng-delta eng-delta--pos">▲ 53 pts</span>
                  </div>
                  <div className="eng-out-row">
                    <span className="eng-out-val" id="n1" suppressHydrationWarning>91</span>
                    <span className="eng-out-unit"> {t('index.svgR1Unit')}</span>
                  </div>
                  <div className="eng-out-base">{t('index.svgR1Base')}</div>
                  <div className="eng-out-foot">{t('index.svgR1Footer')} · {t('index.svgR1Delta')}</div>
                </div>

                <div className="eng-out-card">
                  <div className="eng-out-head">
                    <span className="eng-out-title">{t('index.svgR2Title')}</span>
                    <span className="eng-delta eng-delta--pos">{t('index.svgR2Delta')}</span>
                  </div>
                  <div className="eng-out-row">
                    <span className="eng-out-val" id="n2" suppressHydrationWarning>9.6</span>
                    <span className="eng-out-unit"> × EV/EBITDA</span>
                  </div>
                  <div className="eng-out-base">{t('index.svgR2Base')}</div>
                  <div className="eng-out-foot">{t('index.svgR2Footer')} · {t('index.svgR2Delta')}</div>
                </div>

                <div className="eng-out-card">
                  <div className="eng-out-head">
                    <span className="eng-out-title">{t('index.svgR3Title')}</span>
                    <span className="eng-delta eng-delta--pos">{t('index.svgR3Delta')}</span>
                  </div>
                  <div className="eng-out-row">
                    <span className="eng-out-pfx">+</span>
                    <span className="eng-out-val" id="n3" suppressHydrationWarning>58</span>
                    <span className="eng-out-unit">%</span>
                  </div>
                  <div className="eng-out-base">{t('index.svgR3Desc')}</div>
                  <div className="eng-out-foot">{t('index.svgR3Footer')}</div>
                </div>

                <div className="eng-out-card">
                  <div className="eng-out-head">
                    <span className="eng-out-title">{t('index.svgR4Title')}</span>
                    <span className="eng-delta eng-delta--pos">+$8.2M</span>
                  </div>
                  <div className="eng-out-row">
                    <span className="eng-out-pfx">+</span>
                    <span className="eng-out-val" id="n4" suppressHydrationWarning>34</span>
                    <span className="eng-out-unit">%</span>
                  </div>
                  <div className="eng-out-base">$24.2M → $32.4M</div>
                  <div className="eng-out-foot">{t('index.svgR4Footer')}</div>
                </div>
              </div>

            </div>
          </div>
        </section>


      <section className="process">
        <div className="wrap">
          <div className="chapter-head">
            <span className="chapter-num" aria-hidden>02</span>
            <div className="chapter-head-body">
              <span className="chapter-kicker">// chapter 02 // flow</span>
              <h2 className="chapter-title">{t('index.procTitle')}<br /><span className="chapter-accent">{t('index.procTitleAccent')}</span></h2>
              <p className="chapter-lead">{t('index.procLead')}</p>
            </div>
          </div>
          <div ref={procWrapRef} className="proc-ladder-wrap">
            <ol ref={procLadderRef} className="proc-ladder">
              {(t('index.proc', { returnObjects: true })).map((p, i) => (
                <li key={i} className="proc-rung" data-state="future">
                  <span className="proc-rung-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="proc-rung-body">
                    <span className="proc-rung-eyebrow">{p.num.replace(/^\s*\d+\s*[—–-]\s*/, '')}</span>
                    <span className="proc-rung-title">{p.title}</span>
                    <span className="proc-rung-desc">{p.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="services light-theme">
        <div className="wrap">
          <div className="chapter-head">
            <span className="chapter-num" aria-hidden>03</span>
            <div className="chapter-head-body">
              <span className="chapter-kicker">// chapter 03 // capabilities</span>
              <h2 className="chapter-title">{t('index.svcTitle')}<br /><span className="chapter-accent">{t('index.svcTitleAccent')}</span></h2>
              <p className="chapter-lead">{t('index.svcSub')}</p>
            </div>
          </div>
          <div className="bento">
            <div className="b-card wide accent reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">01</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <div className="svc-title">{t('index.svcs.0.title')}</div>
              <div className="svc-desc">{t('index.svcs.0.desc')}</div>
              <span className="svc-tag">{t('index.svcs.0.tag')}</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">02</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
              <div className="svc-title">{t('index.svcs.1.title')}</div>
              <div className="svc-desc">{t('index.svcs.1.desc')}</div>
              <span className="svc-tag">{t('index.svcs.1.tag')}</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">03</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
              <div className="svc-title">{t('index.svcs.2.title')}</div>
              <div className="svc-desc">{t('index.svcs.2.desc')}</div>
              <span className="svc-tag">{t('index.svcs.2.tag')}</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">04</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="svc-title">{t('index.svcs.3.title')}</div>
              <div className="svc-desc">{t('index.svcs.3.desc')}</div>
              <span className="svc-tag">{t('index.svcs.3.tag')}</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">05</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="svc-title">{t('index.svcs.4.title')}</div>
              <div className="svc-desc">{t('index.svcs.4.desc')}</div>
              <span className="svc-tag">{t('index.svcs.4.tag')}</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">06</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div className="svc-title">{t('index.svcs.5.title')}</div>
              <div className="svc-desc">{t('index.svcs.5.desc')}</div>
              <span className="svc-tag">{t('index.svcs.5.tag')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-strip">
        <div className="wrap">
          <div className="chapter-head">
            <span className="chapter-num" aria-hidden>04</span>
            <div className="chapter-head-body">
              <span className="chapter-kicker">// chapter 04 // proof</span>
              <h2 className="chapter-title">{t('index.kpiTitle')}<br /><span className="chapter-accent">{t('index.kpiTitleAccent')}</span></h2>
              <p className="chapter-lead">{t('index.kpiLead')}</p>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="2486" data-suffix="+">0</div>
              <div className="kpi-lbl">{t('index.kpiLbls.0')}</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="88"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="186" data-suffix="+">0</div>
              <div className="kpi-lbl">{t('index.kpiLbls.1')}</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="72"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="320" data-suffix="+">0</div>
              <div className="kpi-lbl">{t('index.kpiLbls.2')}</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="80"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="68" data-suffix="%">0</div>
              <div className="kpi-lbl">{t('index.kpiLbls.3')}</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="68"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-prefix="$" data-count="42" data-suffix="B+">0</div>
              <div className="kpi-lbl">{t('index.kpiLbls.4')}</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="95"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Cases / Success Wall */}
      <section className="success-wall">
        <div className="sw-head reveal">
          <div className="sw-title">{t('index.swTitle')}</div>
          <div className="sw-divider"></div>
        </div>

        {/* Row 1: IPO 成功上市 */}
        <div className="sw-row-label">{t('index.rowIpo')}</div>
        <div className="marquee-wrap">
          <div className="marquee-track go-left">
            {[0, 1].map(setIdx => (
              <Fragment key={setIdx}>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 108 32" xmlns="http://www.w3.org/2000/svg" height="32">
                      <text x="1" y="26" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="#e8edf5" letterSpacing="-1">ARM</text>
                      <text x="60" y="26" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="#2563EB" letterSpacing="-1">OGI</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">BTOC</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 138 32" xmlns="http://www.w3.org/2000/svg" height="32">
                      <polygon points="16,4 24,4 28,11 24,18 16,18 12,11" fill="#D97706"/>
                      <text x="20" y="15" fontFamily="'Arial Black',sans-serif" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle" fontWeight="900">M</text>
                      <text x="34" y="24" fontFamily="'Arial Black',Impact,sans-serif" fontSize="18" fontWeight="900" fill="#e8edf5">MASSIMO</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">MAMO</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 128 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <polygon points="14,32 22,32 18,20" fill="#0284C7"/>
                      <polygon points="10,32 14,32 18,20" fill="#60A5FA" opacity="0.6"/>
                      <text x="28" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900" fill="#e8edf5">BAIYA</text>
                      <line x1="28" y1="30" x2="118" y2="30" stroke="#2a3344" strokeWidth="0.8"/>
                      <text x="28" y="36" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#5b667d" letterSpacing="0.04em">Baiya International Group Inc.</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">BIYA</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 148 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <text x="1" y="22" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontStyle="italic" fontWeight="700" fill="#0369A1">Autozi.com</text>
                      <text x="2" y="34" fontFamily="'Arial',sans-serif" fontSize="13" fontWeight="700" fill="#F97316" fontStyle="italic">中驰车福</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">AZI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 168 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="4" width="28" height="28" rx="5" fill="#1E40AF"/>
                      <text x="14" y="22" fontFamily="'Arial Black',sans-serif" fontSize="17" fill="#fff" textAnchor="middle" dominantBaseline="middle" fontWeight="900">M</text>
                      <text x="36" y="18" fontFamily="'Arial Black',sans-serif" fontSize="14" fill="#e8edf5" fontWeight="900">MAISON</text>
                      <text x="36" y="32" fontFamily="Arial,sans-serif" fontSize="10" fill="#8b95ab" fontWeight="600" letterSpacing="0.12em">SOLUTIONS</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">MSS</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card" style={{ minWidth: '200px' }}>
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 170 28" xmlns="http://www.w3.org/2000/svg" height="28">
                      <text x="0" y="22" fontFamily="'Arial Black',Impact,sans-serif" fontSize="20" fontWeight="900" fill="#e8edf5" letterSpacing="0.5">WHITEFIBER</text>
                      <text x="166" y="22" fontFamily="'Arial Black',sans-serif" fontSize="20" fill="#5b667d">_</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">WYFI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 172 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="8" width="11" height="11" rx="2" fill="#0D9488"/>
                      <rect x="13" y="2" width="11" height="11" rx="2" fill="#0D9488"/>
                      <rect x="13" y="15" width="11" height="11" rx="2" fill="#14B8A6" opacity="0.7"/>
                      <text x="30" y="16" fontFamily="Arial,sans-serif" fontSize="13" fill="#e8edf5" fontWeight="700">大健云仓</text>
                      <text x="30" y="28" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#0D9488" fontWeight="600" letterSpacing="0.06em">GIGACLOUD TECHNOLOGY</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">GCT</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 148 30" xmlns="http://www.w3.org/2000/svg" height="30">
                      <text x="0" y="24" fontFamily="'Arial Black',sans-serif" fontSize="24" fontWeight="900" fill="#DB2777">聚美优品</text>
                      <text x="100" y="22" fontFamily="Arial,sans-serif" fontSize="10" fill="#5b667d" fontWeight="500" letterSpacing="0.03em">JUMEI.COM</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">JMEI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 156 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="4" width="28" height="28" rx="5" fill="#DC2626"/>
                      <text x="14" y="14" fontFamily="'Arial Black',sans-serif" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="900">步长</text>
                      <text x="14" y="25" fontFamily="'Arial Black',sans-serif" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="900">制药</text>
                      <text x="36" y="20" fontFamily="'Arial Black',sans-serif" fontSize="16" fill="#e8edf5" fontWeight="900">Buchang</text>
                      <text x="36" y="32" fontFamily="Arial,sans-serif" fontSize="9" fill="#5b667d" letterSpacing="0.06em">BUCHANG PHARMA</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">ZBT</span><span className="ipo-card-exch">A股</span></div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Row 2: 合作伙伴 */}
        <div className="sw-row-label" style={{ marginTop: '28px' }}>{t('index.rowPartner')}</div>
        <div className="marquee-wrap">
          <div className="marquee-track go-right">
            {[0, 1].map(setIdx => (
              <Fragment key={setIdx}>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 80 20" height="20" xmlns="http://www.w3.org/2000/svg"><polygon points="10,18 16,18 13,10" fill="#16A34A"/><text x="19" y="16" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#DC2626">新东方</text><text x="60" y="14" fontFamily="Arial,sans-serif" fontSize="8" fill="#5b667d">XDF.CN</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 120 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="13" fontWeight="900" fill="#2563EB">intelliFusion</text><text x="82" y="15" fontFamily="Arial,sans-serif" fontSize="9" fill="#5b667d"> 云天励飞</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 72 20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="#2b62e3" strokeWidth="2"/><circle cx="10" cy="10" r="3" fill="#2b62e3"/><text x="22" y="15" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#e8edf5">格灵深瞳</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 100 20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="5" width="8" height="8" rx="1.5" fill="#0D9488"/><rect x="10" y="1" width="8" height="8" rx="1.5" fill="#0D9488"/><rect x="10" y="11" width="8" height="8" rx="1.5" fill="#14B8A6" opacity="0.7"/><text x="22" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#e8edf5">拉卡拉</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 88 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',sans-serif" fontSize="15" fontWeight="900" fill="#F97316">一起作业</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial',sans-serif" fontSize="13" fontWeight="700" fill="#1E40AF">BaTeLab</text><text x="60" y="12" fontFamily="serif" fontSize="11" fill="#3B82F6">β</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 96 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',Impact,sans-serif" fontSize="15" fontWeight="900" fill="#1E3A8A" letterSpacing="0.5">CONTROLSYS</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 44 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#0369A1" letterSpacing="1">CFAR</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="3" width="14" height="14" rx="2" fill="#5b667d"/><text x="7" y="13" fontFamily="'Arial Black',sans-serif" fontSize="8" fill="#0f1219" textAnchor="middle" fontWeight="900">M</text><text x="18" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="600" fill="#8b95ab">MICROOS</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#0F766E">全盛科技</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 42 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',Impact,sans-serif" fontSize="18" fontWeight="900" fill="#16A34A">Nums</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 82 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#e8edf5">Vfine</text><text x="43" y="15" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="600" fill="#8b95ab"> MUSIC</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 72 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#B45309">帕皮科技</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 56 20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="#e8edf5"/><text x="10" y="14" fontFamily="Arial,sans-serif" fontSize="7" fill="#0f1219" textAnchor="middle" fontWeight="700">ETB</text><text x="24" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#e8edf5">com</text></svg></div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="footer">
            <div className="footer-l">{t('index.footerCopy')}</div>
            <div className="footer-r">{t('index.footerTagline')}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
