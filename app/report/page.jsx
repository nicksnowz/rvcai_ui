'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const SCORE_STATICS = [
  { val: 74, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { val: 70, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { val: 63, color: '#F59E0B', grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
  { val: 58, color: '#F59E0B', grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
  { val: 65, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { val: 71, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
];

const LINK_ICONS = [
  (<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />),
  (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>),
  (<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  (<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />),
  (<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
];

export default function Report() {
  const { t } = useTranslation();
  const [activeSidebarLink, setActiveSidebarLink] = useState(0);

  const SIDEBAR_SCORES = useMemo(() => {
    const names = t('report.sidebarScores', { returnObjects: true });
    return SCORE_STATICS.map((s, i) => ({ ...s, name: names[i].name }));
  }, [t]);

  const SIDEBAR_LINKS = useMemo(() => {
    const labels = t('report.sidebarLinks', { returnObjects: true });
    return labels.map((label, i) => ({ label, icon: LINK_ICONS[i] }));
  }, [t]);

  const OPPORTUNITIES = useMemo(() => t('report.opportunities', { returnObjects: true }), [t]);
  const RISKS = useMemo(() => t('report.risks', { returnObjects: true }), [t]);
  const ROADMAP = useMemo(() => t('report.roadmap', { returnObjects: true }), [t]);
  const RADAR_LABELS = useMemo(() => t('report.radarLabels', { returnObjects: true }), [t]);
  const PATHWAYS = useMemo(() => t('report.pathways', { returnObjects: true }), [t]);

  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vis'), i * 80);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="page light-theme">
      <div className="report-page">
        <div className="report-wrap">
          <div className="breadcrumb reveal">
            <Link href="/">{t('report.breadcrumbHome')}</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--t2)', fontWeight: 500 }}>{t('report.breadcrumbCurrent')}</span>
          </div>

          {/* Header card */}
          <div className="report-head-card reveal">
            <div className="rhc-left">
              <div className="rhc-ey">{t('report.headEyebrow')}</div>
              <div className="rhc-co">{t('report.companyName')}</div>
              <div className="rhc-meta">
                <span className="rhc-mi">{t('report.companyMeta1')}</span><span className="rhc-sep">·</span>
                <span className="rhc-mi">{t('report.companyMeta2')}</span><span className="rhc-sep">·</span>
                <span className="rhc-mi">{t('report.companyMeta3')}</span><span className="rhc-sep">·</span>
                <span className="rhc-mi">{t('report.reportId')}：RVC-2025-09342</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="score-ring-wrap">
                <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#23B7FF" />
                      <stop offset="100%" stopColor="#0B6FFB" />
                    </linearGradient>
                  </defs>
                  <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="55" cy="55" r="44" fill="none" stroke="url(#rg)" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray="276.5" strokeDashoffset="91"
                    transform="rotate(-90 55 55)"
                  >
                    <animate attributeName="stroke-dashoffset" from="276.5" to="91" dur="1.8s" fill="freeze" />
                  </circle>
                </svg>
                <div className="score-center">
                  <div className="score-num">68</div>
                  <div className="score-denom">/100</div>
                </div>
              </div>
              <div className="score-badge">{t('report.scoreBadge')}</div>
            </div>
            <div className="rhc-acts">
              <button className="btn-wh-ghost">{t('report.shareReport')}</button>
              <button className="btn-wh">{t('report.downloadPdf')}</button>
            </div>
          </div>

          <div className="report-cols">
            {/* Sidebar */}
            <div className="rsb reveal">
              <div className="rsb-title">{t('report.sidebarScoresTitle')}</div>
              <div className="rsb-scores">
                {SIDEBAR_SCORES.map(s => (
                  <div key={s.name}>
                    <div className="rsb-sr">
                      <span className="rsb-sn">{s.name}</span>
                      <span className="rsb-sv" style={{ color: s.color }}>{s.val}</span>
                    </div>
                    <div className="rsb-sb">
                      <div className="rsb-sf" style={{ width: s.val + '%', background: s.grad }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rsb-title">{t('report.sidebarNavTitle')}</div>
              {SIDEBAR_LINKS.map((l, idx) => (
                <button
                  key={l.label}
                  className={activeSidebarLink === idx ? 'rsb-link active' : 'rsb-link'}
                  onClick={() => setActiveSidebarLink(idx)}
                >
                  <svg viewBox="0 0 24 24">{l.icon}</svg>
                  {l.label}
                </button>
              ))}
              <div className="rsb-title" style={{ marginTop: 12 }}>{t('report.advisorTitle')}</div>
              <div className="rsb-advisor">
                <div className="rsb-av-avatar">{t('report.advisorInitial')}</div>
                <div className="rsb-av-name">{t('report.advisorName')}</div>
                <div className="rsb-av-title">{t('report.advisorRole')}</div>
                <button className="rsb-av-btn">{t('report.bookMeeting')}</button>
              </div>
            </div>

            {/* Content */}
            <div className="report-content">
              {/* Score Overview */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.overviewTitle')}</div>
                    <div className="sch-sub">{t('report.overviewSub')}</div>
                  </div>
                  <span className="tag tag-blue">{t('report.topQuartile')}</span>
                </div>
                <div className="sec-card-body">
                  <div className="score-grid">
                    <div className="sb">
                      <div className="sb-val" style={{ color: '#0B6FFB' }}>68</div>
                      <div className="sb-name">{t('report.overallScore')}</div>
                      <div className="sb-trend" style={{ color: '#16B364' }}>{t('report.scoreTrend')}</div>
                    </div>
                    <div className="sb">
                      <div className="sb-val" style={{ color: '#42526E' }}>59</div>
                      <div className="sb-name">{t('report.industryMedian')}</div>
                      <div className="sb-trend" style={{ color: '#6B7890' }}>{t('report.scoreContext')}</div>
                    </div>
                    <div className="sb">
                      <div className="sb-val" style={{ color: '#16B364' }}>+9</div>
                      <div className="sb-name">{t('report.outperform')}</div>
                      <div className="sb-trend" style={{ color: '#16B364' }}>{t('report.scorePercentile')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.radarTitle')}</div>
                    <div className="sch-sub">{t('report.radarSub')}</div>
                  </div>
                </div>
                <div className="sec-card-body">
                  <div className="radar-wrap">
                    <div>
                      <svg viewBox="0 0 300 300" width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="rag" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0B6FFB" stopOpacity=".28" />
                            <stop offset="100%" stopColor="#23B7FF" stopOpacity=".14" />
                          </linearGradient>
                        </defs>
                        <polygon points="150,30 246,90 246,210 150,270 54,210 54,90" fill="none" stroke="rgba(11,111,251,0.08)" strokeWidth="1" />
                        <polygon points="150,60 222,105 222,195 150,240 78,195 78,105" fill="none" stroke="rgba(11,111,251,0.08)" strokeWidth="1" />
                        <polygon points="150,90 198,120 198,180 150,210 102,180 102,120" fill="none" stroke="rgba(11,111,251,0.08)" strokeWidth="1" />
                        <polygon points="150,120 174,135 174,165 150,180 126,165 126,135" fill="none" stroke="rgba(11,111,251,0.08)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="150" y2="30" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="246" y2="90" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="246" y2="210" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="150" y2="270" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="54" y2="210" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <line x1="150" y1="150" x2="54" y2="90" stroke="rgba(11,111,251,0.1)" strokeWidth="1" />
                        <polygon
                          points="150,79.2 215.4,116.4 215.4,183.6 150,220.8 84.6,183.6 84.6,116.4"
                          fill="none" stroke="rgba(11,111,251,0.16)" strokeWidth="1.5" strokeDasharray="4 3" opacity=".6"
                        />
                        <polygon
                          points="150,61.2 222.7,108 215.5,187.8 150,219.6 82.4,189 76.2,107.4"
                          fill="url(#rag)" stroke="#0B6FFB" strokeWidth="2" opacity=".9"
                        />
                        <circle cx="150" cy="61.2" r="4" fill="#0B6FFB" stroke="white" strokeWidth="1.5" />
                        <circle cx="222.7" cy="108" r="4" fill="#0B6FFB" stroke="white" strokeWidth="1.5" />
                        <circle cx="215.5" cy="187.8" r="4" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
                        <circle cx="150" cy="219.6" r="4" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
                        <circle cx="82.4" cy="189" r="4" fill="#0B6FFB" stroke="white" strokeWidth="1.5" />
                        <circle cx="76.2" cy="107.4" r="4" fill="#0B6FFB" stroke="white" strokeWidth="1.5" />
                        <text x="150" y="22" textAnchor="middle" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[0]}</text>
                        <text x="256" y="94" textAnchor="start" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[1]}</text>
                        <text x="256" y="210" textAnchor="start" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[2]}</text>
                        <text x="150" y="285" textAnchor="middle" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[3]}</text>
                        <text x="42" y="210" textAnchor="end" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[4]}</text>
                        <text x="42" y="94" textAnchor="end" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">{RADAR_LABELS[5]}</text>
                      </svg>
                    </div>
                    <div className="radar-legend">
                      {SIDEBAR_SCORES.map(s => (
                        <div key={s.name} className="rl-item">
                          <div className="rl-row">
                            <span className="rl-name">{s.name}</span>
                            <span className="rl-val" style={s.color === '#F59E0B' ? { color: '#F59E0B' } : undefined}>{s.val}</span>
                          </div>
                          <div className="rl-bar">
                            <div className="rl-fill" style={{ width: s.val + '%', background: s.grad }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 10, color: 'var(--t4)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 14, height: 2, background: '#0B6FFB', display: 'inline-block' }} />
                          {t('report.legendCompany')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 14, height: 2, background: 'rgba(11,111,251,0.3)', borderTop: '2px dashed rgba(11,111,251,0.4)', display: 'inline-block' }} />
                          {t('report.legendBenchmark')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capital Pathways */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.pathwaysTitle')}</div>
                    <div className="sch-sub">{t('report.pathwaysSub')}</div>
                  </div>
                </div>
                <div className="sec-card-body">
                  <div className="path-grid">
                    <div className="path-card rec">
                      <div className="pc-badge" style={{ color: '#0B6FFB', background: 'rgba(11,111,251,0.08)' }}>⭐ {t('report.pathPrimary')}</div>
                      <div className="pc-title">{PATHWAYS[0].title}</div>
                      <div className="pc-desc">{PATHWAYS[0].desc}</div>
                      <div className="pc-timeline">{PATHWAYS[0].timeline}</div>
                    </div>
                    <div className="path-card">
                      <div className="pc-badge" style={{ color: '#16B364', background: 'rgba(22,179,100,0.08)' }}>{t('report.pathAlternative')}</div>
                      <div className="pc-title">{PATHWAYS[1].title}</div>
                      <div className="pc-desc">{PATHWAYS[1].desc}</div>
                      <div className="pc-timeline">{PATHWAYS[1].timeline}</div>
                    </div>
                    <div className="path-card">
                      <div className="pc-badge" style={{ color: '#9AA6B8', background: 'rgba(154,166,184,0.1)' }}>{t('report.pathOption')}</div>
                      <div className="pc-title">{PATHWAYS[2].title}</div>
                      <div className="pc-desc">{PATHWAYS[2].desc}</div>
                      <div className="pc-timeline">{PATHWAYS[2].timeline}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunities */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.opportunitiesTitle')}</div>
                    <div className="sch-sub">{t('report.opportunitiesSub')}</div>
                  </div>
                  <span className="tag tag-green">{t('report.opportunitiesCount')}</span>
                </div>
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colOpportunity')}</th>
                        <th>{t('report.colDimension')}</th>
                        <th>{t('report.colImpact')}</th>
                        <th>{t('report.colDifficulty')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OPPORTUNITIES.map((o, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{o.name}</td>
                          <td><span className={`tag ${o.dimTag}`}>{o.dim}</span></td>
                          <td><span className="imp-b" style={{ background: 'rgba(22,179,100,0.1)', color: '#16B364' }}>{o.impact}</span></td>
                          <td style={{ color: 'var(--t3)' }}>{o.diff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risks */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.risksTitle')}</div>
                    <div className="sch-sub">{t('report.risksSub')}</div>
                  </div>
                  <span className="tag tag-orange">{t('report.risksCount')}</span>
                </div>
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <table className="opp-table">
                    <thead>
                      <tr>
                        <th>{t('report.colRiskFactor')}</th>
                        <th>{t('report.colLevel')}</th>
                        <th>{t('report.colMitigation')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RISKS.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{r.name}</td>
                          <td><span className="imp-b" style={{ background: r.levelBg, color: r.levelColor }}>{r.level}</span></td>
                          <td style={{ fontSize: 12, color: 'var(--t2)' }}>{r.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Roadmap */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('report.roadmapTitle')}</div>
                    <div className="sch-sub">{t('report.roadmapSub')}</div>
                  </div>
                  <Link href="/ipo" className="btn-sm">{t('report.viewIpoConsole')}</Link>
                </div>
                <div className="sec-card-body">
                  <div className="roadmap">
                    {ROADMAP.map((p, i) => (
                      <div key={i} className="rm-phase">
                        <div className="rm-dot">{p.days}</div>
                        <div className="rm-phase-label">{p.label}</div>
                        <div className="rm-phase-title">{p.title}</div>
                        <div className="rm-actions">
                          {p.actions.map((a, j) => (
                            <div key={j} className="rm-action">{a}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
