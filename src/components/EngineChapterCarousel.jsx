'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function ChapterHead({ t }) {
  return (
    <div className="chapter-head">
      <span className="chapter-num" aria-hidden>01</span>
      <div className="chapter-head-body">
        <span className="chapter-kicker">// chapter 01 // engine</span>
        <h2 className="chapter-title">
          {t('index.engineTitle')}<br />
          <span className="chapter-accent">{t('index.engineTitleAccent')}</span>
        </h2>
        <p className="chapter-lead">{t('index.engineLead')}</p>
      </div>
    </div>
  );
}

const INPUTS = [
  { code: 'F-01', sub: 'svgI1Sub', data: 'svgI1Data' },
  { code: 'O-02', sub: 'svgI2Sub', data: 'svgI2Data' },
  { code: 'M-03', sub: 'svgI3Sub', data: 'svgI3Data' },
  { code: 'S-04', sub: 'svgI4Sub', data: 'svgI4Data' },
];

const OUTPUTS = [
  { code: 'R-01', titleKey: 'svgR1Title', value: '91',  unit: '/100',        before: '38',     delta: '+53 pts' },
  { code: 'R-02', titleKey: 'svgR2Title', value: '9.6', unit: '× EV/EBITDA', before: '7.2×',   delta: '+33%' },
  { code: 'R-03', titleKey: 'svgR3Title', value: '+58', unit: '%',           before: '0%',     delta: '+58 pts' },
  { code: 'R-04', titleKey: 'svgR4Title', value: '+34', unit: '%',           before: '$24.2M', delta: '+$8.2M' },
];

// ── V1 — Tri-panel radar (current live implementation, verbatim) ─────
function EngineV1({ t }) {
  return (
    <>
      <ChapterHead t={t} />
      <div className="eng-stage">
        <div className="eng-panel eng-panel--in">
          <div className="eng-panel-lbl">{t('index.engineInputs')}</div>

          <div className="eng-in-card">
            <div className="eng-in-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div className="eng-in-body">
              <div className="eng-in-name">{t('index.svgI1Sub')}</div>
              <div className="eng-in-tag">{t('index.svgI1Data')}</div>
            </div>
          </div>

          <div className="eng-in-card">
            <div className="eng-in-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="eng-in-body">
              <div className="eng-in-name">{t('index.svgI2Sub')}</div>
              <div className="eng-in-tag">{t('index.svgI2Data')}</div>
            </div>
          </div>

          <div className="eng-in-card">
            <div className="eng-in-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M6.34 17.66l-1.41 1.41"/>
              </svg>
            </div>
            <div className="eng-in-body">
              <div className="eng-in-name">{t('index.svgI3Sub')}</div>
              <div className="eng-in-tag">{t('index.svgI3Data')}</div>
            </div>
          </div>

          <div className="eng-in-card">
            <div className="eng-in-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="eng-in-body">
              <div className="eng-in-name">{t('index.svgI4Sub')}</div>
              <div className="eng-in-tag">{t('index.svgI4Data')}</div>
            </div>
          </div>
        </div>

        <div className="eng-core">
          <svg className="eng-flow eng-flow--in" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line x1="0" y1="14" x2="100" y2="50" /><line x1="0" y1="38" x2="100" y2="50" />
            <line x1="0" y1="62" x2="100" y2="50" /><line x1="0" y1="86" x2="100" y2="50" />
          </svg>
          <svg className="eng-flow eng-flow--out" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line x1="0" y1="50" x2="100" y2="14" /><line x1="0" y1="50" x2="100" y2="38" />
            <line x1="0" y1="50" x2="100" y2="62" /><line x1="0" y1="50" x2="100" y2="86" />
          </svg>
          <span className="eng-port eng-port--in" aria-hidden></span>
          <span className="eng-port eng-port--out" aria-hidden></span>
          <div className="eng-panel-lbl">{t('index.engineCore')}</div>
          <div className="eng-gauge">
            <svg className="eng-gauge-svg" viewBox="0 0 200 200" aria-hidden>
              <circle className="eng-radar-inner-ring" cx="100" cy="100" r="60" />
              <circle className="eng-radar-ticks" cx="100" cy="100" r="72" />
              <circle className="eng-radar-track" cx="100" cy="100" r="80" />
              <circle className="eng-radar-progress" cx="100" cy="100" r="80" strokeDasharray="502.6" strokeDashoffset="160.8" />
              <circle className="eng-radar-scan" cx="100" cy="100" r="92" />
              <circle className="eng-radar-node" cx="156.6" cy="43.4" r="4.5" />
              <circle className="eng-radar-node" cx="48" cy="76" r="3.5" style={{ opacity: 0.7 }} />
              <circle className="eng-radar-node" cx="144" cy="144" r="3" style={{ opacity: 0.5 }} />
            </svg>
            <div className="eng-gauge-center">
              <span className="eng-gauge-num" id="svgScore" suppressHydrationWarning>68</span>
              <span className="eng-gauge-denom">/ 100</span>
              <span className="eng-gauge-lbl">{t('index.svgScore')}</span>
            </div>
          </div>
          <div className="eng-dims">300+ {t('index.engineDims')}</div>
        </div>

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
    </>
  );
}

// ── V2 — Diagnostic Schematic (engineering blueprint) ────────────────
function EngineV2({ t }) {
  return (
    <>
      <ChapterHead t={t} />
      <div className="engb">
        <div className="engb-frame">
          <div className="engb-frame-meta">
            <span>FIG.01 · DIAGNOSTIC_ENGINE / SIGNAL_FLOW</span>
            <span>SCALE 1:1 · 300+ DIMS</span>
          </div>

          <div className="engb-board">
            <div className="engb-col engb-col--in">
              {INPUTS.map((row, i) => (
                <div key={row.code} className={`engb-node engb-node--in${i === 1 ? ' is-active' : ''}`}>
                  <span className="engb-node-port" aria-hidden />
                  <span className="engb-node-code">{row.code}</span>
                  <span className="engb-node-name">{t(`index.${row.sub}`)}</span>
                  <span className="engb-node-meta">{t(`index.${row.data}`)}</span>
                </div>
              ))}
            </div>

            <svg className="engb-wires" viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden>
              {[45, 135, 225, 315].map((y, i) => (
                <path key={`in-${i}`} className={`engb-wire${i === 1 ? ' is-active' : ''}`} d={`M0 ${y} L120 ${y} L180 180`} />
              ))}
              {[45, 135, 225, 315].map((y, i) => (
                <path key={`out-${i}`} className={`engb-wire${i === 1 ? ' is-active' : ''}`} d={`M220 180 L280 ${y} L400 ${y}`} />
              ))}
            </svg>

            <div className="engb-core">
              <div className="engb-core-frame">
                <span className="engb-core-corner engb-core-corner--tl" aria-hidden />
                <span className="engb-core-corner engb-core-corner--tr" aria-hidden />
                <span className="engb-core-corner engb-core-corner--bl" aria-hidden />
                <span className="engb-core-corner engb-core-corner--br" aria-hidden />
                <div className="engb-core-label">DIAGNOSTIC_CORE</div>
                <div className="engb-core-score">
                  <span className="engb-core-num" suppressHydrationWarning>68</span>
                  <span className="engb-core-denom">/ 100</span>
                </div>
                <div className="engb-core-foot">{t('index.svgScore')}</div>
              </div>
            </div>

            <div className="engb-col engb-col--out">
              {OUTPUTS.map((row, i) => (
                <div key={row.code} className={`engb-node engb-node--out${i === 1 ? ' is-active' : ''}`}>
                  <span className="engb-node-port" aria-hidden />
                  <span className="engb-node-code">{row.code}</span>
                  <span className="engb-node-name">{t(`index.${row.titleKey}`)}</span>
                  <span className="engb-node-val" suppressHydrationWarning>
                    {row.value}<em>{row.unit}</em>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="engb-frame-meta engb-frame-meta--foot">
            <span>SIG[ACTIVE] · O-02 → R-02</span>
            <span>REV 2026.06</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── V3 — Before / After Diptych ──────────────────────────────────────
function EngineV3({ t }) {
  return (
    <>
      <ChapterHead t={t} />
      <div className="engd">
        <div className="engd-grid">
          <div className="engd-col engd-col--before">
            <div className="engd-col-head">
              <span className="engd-col-tag">BASELINE</span>
              <span className="engd-col-name">Pre-diagnostic portfolio</span>
            </div>
            <ul className="engd-metrics">
              {OUTPUTS.map((row) => (
                <li key={row.code} className="engd-metric">
                  <span className="engd-metric-code">{row.code}</span>
                  <span className="engd-metric-name">{t(`index.${row.titleKey}`)}</span>
                  <span className="engd-metric-val">{row.before}</span>
                </li>
              ))}
            </ul>
            <div className="engd-col-foot">
              <span>Conventional advisory · static benchmarks</span>
            </div>
          </div>

          <div className="engd-pivot" aria-hidden>
            <div className="engd-pivot-line" />
            <div className="engd-pivot-mark">
              <span className="engd-pivot-label">DIAGNOSTIC_ENGINE</span>
              <span className="engd-pivot-num" suppressHydrationWarning>68<em>/100</em></span>
              <span className="engd-pivot-meta">300+ {t('index.engineDims')}</span>
            </div>
            <div className="engd-pivot-arrow">→</div>
          </div>

          <div className="engd-col engd-col--after">
            <div className="engd-col-head">
              <span className="engd-col-tag">DIAGNOSED</span>
              <span className="engd-col-name">Engine-rated portfolio</span>
            </div>
            <ul className="engd-metrics">
              {OUTPUTS.map((row) => (
                <li key={row.code} className="engd-metric is-after">
                  <span className="engd-metric-code">{row.code}</span>
                  <span className="engd-metric-name">{t(`index.${row.titleKey}`)}</span>
                  <span className="engd-metric-val" suppressHydrationWarning>
                    {row.value}<em>{row.unit}</em>
                  </span>
                  <span className="engd-metric-delta">{row.delta}</span>
                </li>
              ))}
            </ul>
            <div className="engd-col-foot">
              <span>Inputs · {INPUTS.map(i => i.code).join(' · ')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── V4 — Score Hero (editorial big-number) ───────────────────────────
function EngineV4({ t }) {
  return (
    <>
      <ChapterHead t={t} />
      <div className="engh">
        <div className="engh-eyebrow">
          <span className="engh-eyebrow-lbl">INPUT_BUS</span>
          {INPUTS.map((row) => (
            <span key={row.code} className="engh-eyebrow-chip">
              <span className="engh-eyebrow-code">{row.code}</span>
              <span className="engh-eyebrow-name">{t(`index.${row.sub}`)}</span>
            </span>
          ))}
          <span className="engh-eyebrow-dims">· 300+ {t('index.engineDims')}</span>
        </div>

        <div className="engh-figure">
          <span className="engh-figure-num" suppressHydrationWarning>68</span>
          <div className="engh-figure-side">
            <span className="engh-figure-denom">/ 100</span>
            <span className="engh-figure-label">{t('index.svgScore')}</span>
            <span className="engh-figure-source">RVC · DIAGNOSTIC_ENGINE</span>
          </div>
        </div>

        <div className="engh-outputs">
          <div className="engh-outputs-head">
            <span>OUTPUT_BUS / 04</span>
            <span>Engine consequences</span>
          </div>
          <div className="engh-output-row">
            {OUTPUTS.map((row) => (
              <div key={row.code} className="engh-output-card">
                <span className="engh-output-code">{row.code}</span>
                <span className="engh-output-name">{t(`index.${row.titleKey}`)}</span>
                <span className="engh-output-val" suppressHydrationWarning>
                  {row.value}<em>{row.unit}</em>
                </span>
                <span className="engh-output-delta">{row.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const VERSIONS = [
  { id: 'v1', label: 'V1 · Tri-panel radar (live)', Render: EngineV1 },
  { id: 'v2', label: 'V2 · Diagnostic schematic',   Render: EngineV2 },
  { id: 'v3', label: 'V3 · Before / After diptych', Render: EngineV3 },
  { id: 'v4', label: 'V4 · Score hero',             Render: EngineV4 },
];

export default function EngineChapterCarousel() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const total = VERSIONS.length;
  const current = VERSIONS[idx];
  const go = (next) => setIdx(((next % total) + total) % total);
  const { Render, label } = current;

  return (
    <section className="engine-section eng-lt engine-carousel" data-version={current.id}>
      <div className="engcar-bar" role="toolbar" aria-label="Chapter 01 design version">
        <button type="button" className="engcar-btn" aria-label="Previous version" onClick={() => go(idx - 1)} disabled={total <= 1}>‹</button>
        <div className="engcar-meta">
          <span className="engcar-index">{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span className="engcar-label">{label}</span>
        </div>
        <div className="engcar-dots" role="tablist">
          {VERSIONS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to ${v.label}`}
              className={`engcar-dot${i === idx ? ' is-active' : ''}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
        <button type="button" className="engcar-btn" aria-label="Next version" onClick={() => go(idx + 1)} disabled={total <= 1}>›</button>
      </div>
      <div className="wrap">
        <Render t={t} />
      </div>
    </section>
  );
}
