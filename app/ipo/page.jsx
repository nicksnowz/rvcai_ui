'use client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Ipo() {
  const { t } = useTranslation();
  const [activeNav, setActiveNav] = useState(0);

  const TL_STEPS = useMemo(() => t('ipo.tlSteps', { returnObjects: true }), [t]);
  const CAT_BARS = useMemo(() => t('ipo.catBars', { returnObjects: true }), [t]);
  const CHECKLIST_ITEMS = useMemo(() => t('ipo.checklistItems', { returnObjects: true }), [t]);
  const RISK_CARDS = useMemo(() => t('ipo.riskCards', { returnObjects: true }), [t]);
  const ACTION_CARDS = useMemo(() => t('ipo.actionCards', { returnObjects: true }), [t]);
  const DEADLINES = useMemo(() => t('ipo.deadlines', { returnObjects: true }), [t]);

  // Scroll reveal
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

  const navLinks = [
    { label: t('ipo.navTimeline'), badge: t('ipo.badgePhases'), badgeClass: '' },
    { label: t('ipo.navChecklist'), badge: '6/15', badgeClass: 'warn' },
    { label: t('ipo.navRisk'), badge: t('ipo.badgeAlerts'), badgeClass: 'warn' },
    { label: t('ipo.navFinance'), badge: '60%', badgeClass: 'ok' },
    { label: t('ipo.navGovernance'), badge: '40%', badgeClass: 'warn' },
    { label: t('ipo.navProspectus'), badge: '0%', badgeClass: 'warn' },
  ];

  const navIcons = [
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
    <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>,
  ];

  return (
    <div className="page light-theme">
      <div className="ipo-page">
        <div className="ipo-wrap">
          {/* Top header */}
          <div className="ipo-top reveal">
            <div className="ipo-top-left">
              <div className="ipo-ey">{t('ipo.headerEyebrow')}</div>
              <div className="ipo-company">{t('ipo.companyName')}</div>
              <div className="ipo-meta">
                <span className="ipo-meta-item">{t('ipo.metaBusiness')}</span>
                <span className="ipo-meta-sep">·</span>
                <span className="ipo-meta-item">{t('ipo.metaRevenue')}</span>
                <span className="ipo-meta-sep">·</span>
                <span className="ipo-meta-item">{t('ipo.metaTargetExchange')}</span>
              </div>
            </div>
            <div className="ipo-score-area">
              <div style={{ textAlign: 'center' }}>
                <div className="ipo-score-ring">
                  <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ipo-g" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#23B7FF" />
                      </linearGradient>
                    </defs>
                    <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="55" cy="55" r="44" fill="none" stroke="url(#ipo-g)" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="276.5" strokeDashoffset="171.4"
                      transform="rotate(-90 55 55)"
                    >
                      <animate attributeName="stroke-dashoffset" from="276.5" to="171.4" dur="1.8s" fill="freeze" />
                    </circle>
                  </svg>
                  <div className="ipo-score-center">
                    <div className="ipo-score-num">38</div>
                    <div className="ipo-score-label">/100</div>
                  </div>
                </div>
                <div className="ipo-score-badge">{t('ipo.scoreBadge')}</div>
              </div>
              <div className="ipo-stat-pills">
                <div className="ipo-pill"><span className="ipo-pill-dot" style={{ background: '#16B364' }}></span>{t('ipo.pillDone')}</div>
                <div className="ipo-pill"><span className="ipo-pill-dot" style={{ background: '#F59E0B' }}></span>{t('ipo.pillProg')}</div>
                <div className="ipo-pill"><span className="ipo-pill-dot" style={{ background: 'rgba(154,166,184,0.5)' }}></span>{t('ipo.pillPending')}</div>
              </div>
            </div>
            <div className="ipo-top-actions">
              <button
                className="btn-white"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '11px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('ipo.exportPdf')}
              </button>
              <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>{t('ipo.bookAdvisor')}</button>
            </div>
          </div>

          {/* Main columns */}
          <div className="ipo-cols">
            {/* Sidebar */}
            <div className="ipo-sidebar reveal">
              <div className="isb-head">
                <div className="isb-head-title">{t('ipo.advisorTitle')}</div>
                <div className="isb-advisor">
                  <div className="isb-av">{t('ipo.advisorInitial')}</div>
                  <div>
                    <div className="isb-av-name">{t('ipo.advisorName')}</div>
                    <div className="isb-av-title">{t('ipo.advisorRole')}</div>
                    <div className="isb-av-exp">{t('ipo.advisorExp')}</div>
                  </div>
                </div>
              </div>

              <div className="isb-nav">
                {navLinks.map((link, i) => (
                  <button
                    key={i}
                    className={`isb-link${activeNav === i ? ' active' : ''}`}
                    onClick={() => setActiveNav(i)}
                  >
                    {navIcons[i]}
                    {link.label}
                    <span className={`isb-link-badge${link.badgeClass ? ' ' + link.badgeClass : ''}`}>{link.badge}</span>
                  </button>
                ))}
              </div>

              {/* Deadlines */}
              <div className="isb-deadline">
                <div className="isb-dl-title">⏰ {t('ipo.deadlinesTitle')}</div>
                {DEADLINES.map((d, i) => (
                  <div key={i} className="isb-dl-item">
                    <span>{d.label}</span>
                    <span className="isb-dl-date">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="ipo-content">

              {/* Timeline */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('ipo.timelineTitle')}</div>
                    <div className="sch-sub">{t('ipo.timelineSub')}</div>
                  </div>
                  <span className="tag tag-blue">{t('ipo.timelineTarget')}</span>
                </div>
                <div className="sec-card-body">
                  <div className="ipo-timeline">
                    {TL_STEPS.map((step, i) => {
                      const sc = step.statusClass;
                      const icons = [
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /></svg>,
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
                        <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
                      ];
                      return (
                        <div key={i} className="tl-step">
                          <div className={`tl-dot ${sc}`}>{icons[i]}</div>
                          <div>
                            <div className={`tl-phase${sc === 'pending' ? ' pending' : ''}`}>{step.phase}</div>
                            <div className="tl-title">{step.title}</div>
                            <div className="tl-date">{step.date}</div>
                            <div className={`tl-status ${sc}`}>{step.status}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Progress by Category */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('ipo.categoryTitle')}</div>
                    <div className="sch-sub">{t('ipo.categorySub')}</div>
                  </div>
                  <span className="tag tag-orange">{t('ipo.categoryOverall')}</span>
                </div>
                <div className="sec-card-body">
                  <div className="prog-summary">
                    <div className="ps-box">
                      <div className="ps-val" style={{ color: 'var(--ok)' }}>3</div>
                      <div className="ps-lbl">{t('ipo.psDone')}</div>
                    </div>
                    <div className="ps-box">
                      <div className="ps-val" style={{ color: 'var(--blue)' }}>3</div>
                      <div className="ps-lbl">{t('ipo.psProg')}</div>
                    </div>
                    <div className="ps-box">
                      <div className="ps-val" style={{ color: 'var(--t4)' }}>9</div>
                      <div className="ps-lbl">{t('ipo.psPending')}</div>
                    </div>
                  </div>
                  <div className="cat-bars">
                    {CAT_BARS.map((bar, i) => {
                      const fills = [
                        { width: '100%', background: 'linear-gradient(90deg,#16B364,#22C55E)' },
                        { width: '60%', background: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
                        { width: '40%', background: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
                        { width: '33%', background: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
                        { width: '3%', background: 'rgba(154,166,184,0.4)' },
                      ];
                      return (
                        <div key={i} className="cat-bar">
                          <div className="cat-bar-row">
                            <span className="cat-bar-name">{bar.name}</span>
                            <span className="cat-bar-stats">{bar.stats}</span>
                          </div>
                          <div className="cat-bar-track"><div className="cat-bar-fill" style={fills[i]}></div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('ipo.checklistTitle')}</div>
                    <div className="sch-sub">{t('ipo.checklistSub')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="tag tag-green">{t('ipo.pillCheckDone')}</span>
                    <span className="tag tag-orange">{t('ipo.pillCheckProg')}</span>
                  </div>
                </div>
                <div className="sec-card-body" style={{ padding: 0 }}>
                  <div className="table-scroll">
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th style={{ width: '36px' }}></th>
                        <th>{t('ipo.colRequirement')}</th>
                        <th>{t('ipo.colOwner')}</th>
                        <th>{t('ipo.colDue')}</th>
                        <th>{t('ipo.colStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHECKLIST_ITEMS.map((item, i) => {
                        const isDone = item.status === 'done';
                        const isProg = item.status === 'prog';
                        const ckClass = isDone ? 'done' : isProg ? 'prog' : 'pending';
                        const ckIcon = isDone
                          ? <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                          : isProg
                            ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>;
                        const statusTag = isDone
                          ? <span className="tag tag-green">{t('ipo.statusDone')}</span>
                          : isProg
                            ? <span className="tag tag-orange">{t('ipo.statusProg')}</span>
                            : <span className="tag" style={{ background: 'rgba(154,166,184,0.1)', color: 'var(--t4)' }}>{t('ipo.statusPending')}</span>;
                        return (
                          <tr key={i}>
                            <td><div className={`ck-check ${ckClass}`}>{ckIcon}</div></td>
                            <td><div className="ck-item-name">{item.name}</div><div className="ck-item-sub">{item.sub}</div></td>
                            <td className="ck-owner">{item.owner}</td>
                            <td className="ck-due" style={isProg ? { color: '#F59E0B' } : undefined}>{item.due}</td>
                            <td>{statusTag}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Risk Panel */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('ipo.riskTitle')}</div>
                    <div className="sch-sub">{t('ipo.riskSub')}</div>
                  </div>
                  <span className="tag tag-orange">{t('ipo.riskCount')}</span>
                </div>
                <div className="sec-card-body">
                  <div className="risk-grid">
                    {RISK_CARDS.map((rc, i) => (
                      <div key={i} className={`risk-card ${rc.severityClass}`}>
                        <div className="rc-severity" style={{ color: rc.severityColor }}>{rc.severity}</div>
                        <div className="rc-title">{rc.title}</div>
                        <div className="rc-desc">{rc.desc}</div>
                        <div className="rc-action"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>{rc.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="sec-card reveal">
                <div className="sec-card-head">
                  <div>
                    <div className="sch-title">{t('ipo.actionsTitle')}</div>
                    <div className="sch-sub">{t('ipo.actionsSub')}</div>
                  </div>
                </div>
                <div className="sec-card-body">
                  <div className="action-grid">
                    {ACTION_CARDS.map((ac, i) => {
                      const icons = [
                        <svg viewBox="0 0 24 24" style={{ stroke: '#0B6FFB' }}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>,
                        <svg viewBox="0 0 24 24" style={{ stroke: '#16B364' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
                        <svg viewBox="0 0 24 24" style={{ stroke: '#D97706' }}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
                      ];
                      const icoBgs = ['rgba(11,111,251,0.08)', 'rgba(22,179,100,0.08)', 'rgba(245,158,11,0.08)'];
                      return (
                        <div key={i} className="action-card">
                          <div className="ac-ico" style={{ background: icoBgs[i] }}>{icons[i]}</div>
                          <div className="ac-title">{ac.title}</div>
                          <div className="ac-desc">{ac.desc}</div>
                          <div className="ac-link"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>{ac.link}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>{/* /ipo-content */}
          </div>{/* /ipo-cols */}
        </div>
      </div>
    </div>
  );
}
