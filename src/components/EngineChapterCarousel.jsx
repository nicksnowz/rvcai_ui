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
          <div className="eng-card-rail">
            {INPUTS.map((row) => (
              <div className="eng-row eng-row--in" key={row.code}>
                <span className="eng-row-code">{row.code}</span>
                <span className="eng-row-name">{t(`index.${row.sub}`)}</span>
                <span className="eng-row-meta">{t(`index.${row.data}`)}</span>
              </div>
            ))}
            <span className="eng-flow eng-flow--in" aria-hidden>
              <span className="eng-flow-line"><span className="eng-flow-pulse" /></span>
              <span className="eng-flow-tip">›</span>
            </span>
          </div>
        </div>

        <div className="eng-core">
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
          <div className="eng-card-rail">
            {OUTPUTS.map((row) => (
              <div className="eng-row eng-row--out" key={row.code}>
                <span className="eng-row-code">{row.code}</span>
                <span className="eng-row-name">{t(`index.${row.titleKey}`)}</span>
                <span className="eng-row-val">{row.value}<em>{row.unit}</em></span>
                <span className="eng-row-delta">{row.delta}</span>
              </div>
            ))}
            <span className="eng-flow eng-flow--out" aria-hidden>
              <span className="eng-flow-line"><span className="eng-flow-pulse" /></span>
              <span className="eng-flow-tip">›</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── V2 — Diagnostic Schematic (engineering blueprint) ────────────────
function EngineV2({ t }) {
  const [activeIn, setActiveIn] = useState(1);
  const [activeOut, setActiveOut] = useState(1);

  return (
    <>
      <ChapterHead t={t} />
      <div className="engb">
        <div className="engb-frame">
          <div className="engb-frame-meta">
            <span>&nbsp;</span>
            <span>SCALE 1:1 · 300+ DIMS</span>
          </div>

          <div className="engb-board">
            <div className="engb-col engb-col--in">
              {INPUTS.map((row, i) => (
                <div
                  key={row.code}
                  className={`engb-node engb-node--in${i === activeIn ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveIn(i)}
                  onFocus={() => setActiveIn(i)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={i === activeIn}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIn(i);
                    }
                  }}
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  <span className="engb-node-port" aria-hidden />
                  <span className="engb-node-code">{row.code}</span>
                  <span className="engb-node-name">{t(`index.${row.sub}`)}</span>
                  <span className="engb-node-meta">{t(`index.${row.data}`)}</span>
                </div>
              ))}
            </div>

            <svg className="engb-wires" viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden style={{ animationDelay: '150ms' }}>
              {[45, 135, 225, 315].map((y, i) => (
                <path key={`in-${i}`} className={`engb-wire${i === activeIn ? ' is-active' : ''}`} d={`M0 ${y} L80 ${y} L110 180`} />
              ))}
              {[45, 135, 225, 315].map((y, i) => (
                <path key={`out-${i}`} className={`engb-wire${i === activeOut ? ' is-active' : ''}`} d={`M290 180 L320 ${y} L400 ${y}`} />
              ))}
            </svg>

            <div className="engb-core" style={{ animationDelay: '220ms' }}>
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
                <div
                  key={row.code}
                  className={`engb-node engb-node--out${i === activeOut ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveOut(i)}
                  onFocus={() => setActiveOut(i)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={i === activeOut}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveOut(i);
                    }
                  }}
                  style={{ animationDelay: `${i * 75}ms` }}
                >
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
            <span>&nbsp;</span>
            <span>REV 2026.06</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── V3 — Input / Process / Output ledger ─────────────────────────────
const PROCESS_STEPS = [
  { code: 'P-01', name: 'Normalize',       meta: 'Cross-source signal alignment' },
  { code: 'P-02', name: 'Model ensemble',  meta: '300+ diagnostic dimensions' },
  { code: 'P-03', name: 'Capital readout', meta: 'Score · multiple · readiness' },
];

function EngineV3({ t }) {
  return (
    <>
      <ChapterHead t={t} />
      <div className="engd">
        <div className="engd-frame">
          <div className="engd-frame-meta">
            <span>RVC.ENGINE / DIAGNOSTIC_LEDGER</span>
            <span>FLOW · IN → CORE → OUT</span>
          </div>

          <div className="engd-grid">
            <div className="engd-col engd-col--in">
              <div className="engd-col-head">
                <span className="engd-col-step">01</span>
                <div className="engd-col-headstack">
                  <span className="engd-col-tag">INPUT</span>
                  <span className="engd-col-name">{t('index.engineInputs')}</span>
                </div>
              </div>
              <ul className="engd-rows">
                {INPUTS.map((row) => (
                  <li key={row.code} className="engd-row">
                    <span className="engd-row-code">{row.code}</span>
                    <span className="engd-row-name">{t(`index.${row.sub}`)}</span>
                    <span className="engd-row-meta">{t(`index.${row.data}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="engd-col-foot">
                <span>04 SOURCES · LIVE FEED</span>
              </div>
            </div>

            <div className="engd-chev engd-chev--left" aria-hidden>
              {[0, 1, 2, 3].map((i) => <span key={i}>▸</span>)}
            </div>

            <div className="engd-col engd-col--core">
              <div className="engd-col-head">
                <span className="engd-col-step engd-col-step--accent">02</span>
                <div className="engd-col-headstack">
                  <span className="engd-col-tag engd-col-tag--accent">PROCESS</span>
                  <span className="engd-col-name">{t('index.engineCore')}</span>
                </div>
              </div>
              <div className="engd-core-block">
                <div className="engd-core-score">
                  <span className="engd-core-num" suppressHydrationWarning>68</span>
                  <span className="engd-core-denom">/100</span>
                </div>
                <div className="engd-core-progress" aria-hidden>
                  <span className="engd-core-progress-fill" style={{ width: '68%' }} />
                </div>
                <div className="engd-core-label">{t('index.svgScore')}</div>
              </div>
              <ul className="engd-rows engd-rows--steps">
                {PROCESS_STEPS.map((step) => (
                  <li key={step.code} className="engd-row engd-row--step">
                    <span className="engd-row-code engd-row-code--accent">{step.code}</span>
                    <span className="engd-row-name">{step.name}</span>
                    <span className="engd-row-meta">{step.meta}</span>
                  </li>
                ))}
              </ul>
              <div className="engd-col-foot">
                <span>300+ {t('index.engineDims')}</span>
              </div>
            </div>

            <div className="engd-chev engd-chev--right" aria-hidden>
              {[0, 1, 2, 3].map((i) => <span key={i}>▸</span>)}
            </div>

            <div className="engd-col engd-col--out">
              <div className="engd-col-head">
                <span className="engd-col-step">03</span>
                <div className="engd-col-headstack">
                  <span className="engd-col-tag">OUTPUT</span>
                  <span className="engd-col-name">{t('index.engineOutputs')}</span>
                </div>
              </div>
              <ul className="engd-rows">
                {OUTPUTS.map((row) => (
                  <li key={row.code} className="engd-row engd-row--out">
                    <span className="engd-row-code">{row.code}</span>
                    <span className="engd-row-name">{t(`index.${row.titleKey}`)}</span>
                    <span className="engd-row-val" suppressHydrationWarning>
                      {row.value}<em>{row.unit}</em>
                    </span>
                    <span className="engd-row-delta">{row.delta}</span>
                  </li>
                ))}
              </ul>
              <div className="engd-col-foot">
                <span>04 READOUTS · Δ vs baseline</span>
              </div>
            </div>
          </div>

          <div className="engd-frame-meta engd-frame-meta--foot">
            <span>{INPUTS.map(i => i.code).join(' · ')}</span>
            <span>{OUTPUTS.map(o => o.code).join(' · ')}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── V4 — Input / Process / Output operating view ─────────────────────
function EngineV4({ t }) {
  const processSteps = [
    { id: '01', label: 'Normalize', detail: 'Map raw operating signals to RVC value taxonomy' },
    { id: '02', label: 'Benchmark', detail: 'Compare against sector peers and capital-market thresholds' },
    { id: '03', label: 'Prioritize', detail: 'Rank gaps by value impact, timing, and execution risk' },
  ];

  return (
    <>
      <ChapterHead t={t} />
      <div className="engh" aria-label="Input process output diagnostic view">
        <div className="engh-shell">
          <div className="engh-head">
            <div>
              <span className="engh-kicker">V4 · OPERATING MODEL</span>
              <h3 className="engh-title">Input, process, output</h3>
            </div>
            <div className="engh-score">
              <span className="engh-score-label">{t('index.svgScore')}</span>
              <span className="engh-score-value" suppressHydrationWarning>68<em>/100</em></span>
            </div>
          </div>

          <div className="engh-flow-grid">
            <section className="engh-lane" aria-label="Diagnostic inputs">
              <div className="engh-lane-head">
                <span>INPUT</span>
                <strong>Signal capture</strong>
              </div>
              <div className="engh-input-list">
                {INPUTS.map((row) => (
                  <article key={row.code} className="engh-input-card">
                    <span className="engh-node-code">{row.code}</span>
                    <div>
                      <h4>{t(`index.${row.sub}`)}</h4>
                      <p>{t(`index.${row.data}`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="engh-process" aria-label="Diagnostic process">
              <div className="engh-lane-head">
                <span>PROCESS</span>
                <strong>Diagnostic engine</strong>
              </div>
              <div className="engh-process-core">
                <span className="engh-core-tag">300+ {t('index.engineDims')}</span>
                <span className="engh-core-name">RVC Diagnostic Core</span>
                <span className="engh-core-line" aria-hidden />
              </div>
              <ol className="engh-step-list">
                {processSteps.map((step) => (
                  <li key={step.id} className="engh-step">
                    <span className="engh-step-id">{step.id}</span>
                    <div>
                      <h4>{step.label}</h4>
                      <p>{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="engh-lane" aria-label="Diagnostic outputs">
              <div className="engh-lane-head">
                <span>OUTPUT</span>
                <strong>Capital actions</strong>
              </div>
              <div className="engh-output-list">
                {OUTPUTS.map((row) => (
                  <article key={row.code} className="engh-output-card">
                    <div className="engh-output-main">
                      <span className="engh-node-code">{row.code}</span>
                      <h4>{t(`index.${row.titleKey}`)}</h4>
                    </div>
                    <div className="engh-output-metric">
                      <span suppressHydrationWarning>{row.value}<em>{row.unit}</em></span>
                      <strong>{row.delta}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
  { id: 'v4', label: 'V4 · Input / Process / Output', Render: EngineV4 },
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
