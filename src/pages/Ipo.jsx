import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ipo.css';

export default function Ipo() {
  const { t } = useTranslation();
  const [activeNav, setActiveNav] = useState(0);

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
    <div className="page">
      <div className="ipo-page">
        <div className="ipo-wrap">
          {/* Top header */}
          <div className="ipo-top reveal">
            <div className="ipo-top-left">
              <div className="ipo-ey">{t('ipo.headerEyebrow')}</div>
              <div className="ipo-company">UC Auto（优车汇）</div>
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
                  <div className="isb-av">余</div>
                  <div>
                    <div className="isb-av-name">余龙文博士</div>
                    <div className="isb-av-title">IPO专家 · 资本市场</div>
                    <div className="isb-av-exp">主导18起IPO · 累计募资 $62亿</div>
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
                <div className="isb-dl-item">
                  <span>Big4 审计洽谈</span>
                  <span className="isb-dl-date">2026年9月</span>
                </div>
                <div className="isb-dl-item">
                  <span>审计委员会成立</span>
                  <span className="isb-dl-date">2026年10月</span>
                </div>
                <div className="isb-dl-item">
                  <span>独立董事增补</span>
                  <span className="isb-dl-date">2026年11月</span>
                </div>
                <div className="isb-dl-item">
                  <span>承销商遴选完成</span>
                  <span className="isb-dl-date">2027年3月</span>
                </div>
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
                    <div className="tl-step">
                      <div className="tl-dot done">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase">第一阶段</div>
                        <div className="tl-title">企业诊断</div>
                        <div className="tl-date">2026年Q1</div>
                        <div className="tl-status done">已完成</div>
                      </div>
                    </div>
                    <div className="tl-step">
                      <div className="tl-dot done">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase">第二阶段</div>
                        <div className="tl-title">差距分析</div>
                        <div className="tl-date">2026年Q2</div>
                        <div className="tl-status done">已完成</div>
                      </div>
                    </div>
                    <div className="tl-step">
                      <div className="tl-dot active">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase">第三阶段</div>
                        <div className="tl-title">治理搭建</div>
                        <div className="tl-date">2026年Q3–2027年Q1</div>
                        <div className="tl-status active">进行中</div>
                      </div>
                    </div>
                    <div className="tl-step">
                      <div className="tl-dot pending">
                        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase pending">第四阶段</div>
                        <div className="tl-title">财务规范</div>
                        <div className="tl-date">2027年</div>
                        <div className="tl-status pending">待启动</div>
                      </div>
                    </div>
                    <div className="tl-step">
                      <div className="tl-dot pending">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase pending">第五阶段</div>
                        <div className="tl-title">招股书起草</div>
                        <div className="tl-date">2027年Q4–2028年Q1</div>
                        <div className="tl-status pending">待启动</div>
                      </div>
                    </div>
                    <div className="tl-step">
                      <div className="tl-dot pending">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                      </div>
                      <div>
                        <div className="tl-phase pending">第六阶段</div>
                        <div className="tl-title">正式上市</div>
                        <div className="tl-date">2028年Q2</div>
                        <div className="tl-status pending">目标</div>
                      </div>
                    </div>
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
                    <div className="cat-bar">
                      <div className="cat-bar-row">
                        <span className="cat-bar-name">业务运营</span>
                        <span className="cat-bar-stats">5/5 项 · 100%</span>
                      </div>
                      <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: '100%', background: 'linear-gradient(90deg,#16B364,#22C55E)' }}></div></div>
                    </div>
                    <div className="cat-bar">
                      <div className="cat-bar-row">
                        <span className="cat-bar-name">财务规范化</span>
                        <span className="cat-bar-stats">3/5 项 · 60%</span>
                      </div>
                      <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: '60%', background: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' }}></div></div>
                    </div>
                    <div className="cat-bar">
                      <div className="cat-bar-row">
                        <span className="cat-bar-name">治理与合规</span>
                        <span className="cat-bar-stats">2/5 项 · 40%</span>
                      </div>
                      <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: '40%', background: 'linear-gradient(90deg,#F59E0B,#FBBF24)' }}></div></div>
                    </div>
                    <div className="cat-bar">
                      <div className="cat-bar-row">
                        <span className="cat-bar-name">法律与监管</span>
                        <span className="cat-bar-stats">1/3 项 · 33%</span>
                      </div>
                      <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: '33%', background: 'linear-gradient(90deg,#F59E0B,#FBBF24)' }}></div></div>
                    </div>
                    <div className="cat-bar">
                      <div className="cat-bar-row">
                        <span className="cat-bar-name">资本市场准备</span>
                        <span className="cat-bar-stats">0/2 项 · 0%</span>
                      </div>
                      <div className="cat-bar-track"><div className="cat-bar-fill" style={{ width: '3%', background: 'rgba(154,166,184,0.4)' }}></div></div>
                    </div>
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
                    <span className="tag tag-green">3项完成</span>
                    <span className="tag tag-orange">3项进行中</span>
                  </div>
                </div>
                <div className="sec-card-body" style={{ padding: 0 }}>
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
                      {/* Done */}
                      <tr>
                        <td><div className="ck-check done"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div></td>
                        <td><div className="ck-item-name">企业价值诊断完成</div><div className="ck-item-sub">300项全维度诊断评估</div></td>
                        <td className="ck-owner">RVC AI引擎</td>
                        <td className="ck-due">2026年3月</td>
                        <td><span className="tag tag-green">已完成</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check done"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div></td>
                        <td><div className="ck-item-name">收入确认会计政策规范</div><div className="ck-item-sub">收入确认规则文档化并实际执行</div></td>
                        <td className="ck-owner">CFO办公室</td>
                        <td className="ck-due">2026年4月</td>
                        <td><span className="tag tag-green">已完成</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check done"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div></td>
                        <td><div className="ck-item-name">公司章程重组完成</div><div className="ck-item-sub">法律主体结构已符合IPO要求</div></td>
                        <td className="ck-owner">法律顾问</td>
                        <td className="ck-due">2026年5月</td>
                        <td><span className="tag tag-green">已完成</span></td>
                      </tr>
                      {/* In Progress */}
                      <tr>
                        <td><div className="ck-check prog"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></td>
                        <td><div className="ck-item-name">Big4 审计机构洽谈</div><div className="ck-item-sub">委托毕马威/普华永道/德勤/安永进行2年期审计</div></td>
                        <td className="ck-owner">CFO + 董事会</td>
                        <td className="ck-due" style={{ color: '#F59E0B' }}>2026年9月</td>
                        <td><span className="tag tag-orange">进行中</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check prog"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></td>
                        <td><div className="ck-item-name">审计委员会筹建</div><div className="ck-item-sub">至少需要3名独立董事，含审计专业背景</div></td>
                        <td className="ck-owner">董事会 / CEO</td>
                        <td className="ck-due" style={{ color: '#F59E0B' }}>2026年10月</td>
                        <td><span className="tag tag-orange">进行中</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check prog"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div></td>
                        <td><div className="ck-item-name">PIPL合规与数据安全体系</div><div className="ck-item-sub">《个人信息保护法》合规架构建设</div></td>
                        <td className="ck-owner">合规负责人</td>
                        <td className="ck-due">2026年11月</td>
                        <td><span className="tag tag-orange">进行中</span></td>
                      </tr>
                      {/* Pending */}
                      <tr>
                        <td><div className="ck-check pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg></div></td>
                        <td><div className="ck-item-name">2年期审计财务报表</div><div className="ck-item-sub">FY2025+FY2026 Big4审计完成版</div></td>
                        <td className="ck-owner">Big4 审计机构</td>
                        <td className="ck-due">2027年6月</td>
                        <td><span className="tag" style={{ background: 'rgba(154,166,184,0.1)', color: 'var(--t4)' }}>待启动</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg></div></td>
                        <td><div className="ck-item-name">独立董事增补（2名）</div><div className="ck-item-sub">引入具有上市公司经验的独立董事</div></td>
                        <td className="ck-owner">CFO + 董事会</td>
                        <td className="ck-due">2026年11月</td>
                        <td><span className="tag" style={{ background: 'rgba(154,166,184,0.1)', color: 'var(--t4)' }}>待启动</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg></div></td>
                        <td><div className="ck-item-name">承销商遴选与委托</div><div className="ck-item-sub">主承销商及联合承销行确定</div></td>
                        <td className="ck-owner">CFO + 董事会</td>
                        <td className="ck-due">2027年Q1</td>
                        <td><span className="tag" style={{ background: 'rgba(154,166,184,0.1)', color: 'var(--t4)' }}>待启动</span></td>
                      </tr>
                      <tr>
                        <td><div className="ck-check pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg></div></td>
                        <td><div className="ck-item-name">招股书（F-1）起草</div><div className="ck-item-sub">SEC注册申报文件准备与法律审核</div></td>
                        <td className="ck-owner">法律 + CFO + 承销商</td>
                        <td className="ck-due">2027年Q4</td>
                        <td><span className="tag" style={{ background: 'rgba(154,166,184,0.1)', color: 'var(--t4)' }}>待启动</span></td>
                      </tr>
                    </tbody>
                  </table>
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
                    <div className="risk-card high">
                      <div className="rc-severity" style={{ color: '#F04438' }}>🔴 高风险</div>
                      <div className="rc-title">Big4审计机构未到位</div>
                      <div className="rc-desc">公开市场投资者要求至少2个完整财年的Big4审计报告，这是优车汇IPO的最大障碍，须立即启动洽谈。</div>
                      <div className="rc-action"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>立即启动 — 2026年9月截止</div>
                    </div>
                    <div className="risk-card high">
                      <div className="rc-severity" style={{ color: '#F04438' }}>🔴 高风险</div>
                      <div className="rc-title">独立董事席位严重不足</div>
                      <div className="rc-desc">SEC / 港交所均要求审计委员会由多数独立董事组成，目前董事会独立成员数量不满足监管要求。</div>
                      <div className="rc-action"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>2026年11月前增补2名独立董事</div>
                    </div>
                    <div className="risk-card medium">
                      <div className="rc-severity" style={{ color: '#D97706' }}>⚠ 中风险</div>
                      <div className="rc-title">PIPL数据合规存在漏洞</div>
                      <div className="rc-desc">平台积累车辆交易用户数据，《个人信息保护法》合规架构尚未完整建立，可能触发监管审查。</div>
                      <div className="rc-action"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>启动数据合规专项整改计划</div>
                    </div>
                    <div className="risk-card low">
                      <div className="rc-severity" style={{ color: '#16B364' }}>✓ 低风险</div>
                      <div className="rc-title">营收增长强劲</div>
                      <div className="rc-desc">同比增长38%，显著优于二手车行业中位数（12%），B端SaaS化转型带来可预期的经常性收入，有利于估值定价。</div>
                      <div className="rc-action"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>保持增长势头至上市窗口期</div>
                    </div>
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
                    <div className="action-card">
                      <div className="ac-ico" style={{ background: 'rgba(11,111,251,0.08)' }}>
                        <svg viewBox="0 0 24 24" style={{ stroke: '#0B6FFB' }}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>
                      </div>
                      <div className="ac-title">对接 Big4 审计机构</div>
                      <div className="ac-desc">RVC将为优车汇提供首席审计合作伙伴的热线引荐——IPO关键路径，建议本周启动。</div>
                      <div className="ac-link"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>预约引荐会议</div>
                    </div>
                    <div className="action-card">
                      <div className="ac-ico" style={{ background: 'rgba(22,179,100,0.08)' }}>
                        <svg viewBox="0 0 24 24" style={{ stroke: '#16B364' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                      </div>
                      <div className="ac-title">独立董事招募计划</div>
                      <div className="ac-desc">物色并引进2名具备上市公司经验的独立董事，需在2026年11月前完成，以满足监管要求。</div>
                      <div className="ac-link"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>查看候选人名单</div>
                    </div>
                    <div className="action-card">
                      <div className="ac-ico" style={{ background: 'rgba(245,158,11,0.08)' }}>
                        <svg viewBox="0 0 24 24" style={{ stroke: '#D97706' }}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                      </div>
                      <div className="ac-title">财务系统专业化升级</div>
                      <div className="ac-desc">部署企业级财务管理系统（SAP / Oracle），建立完整审计轨迹，满足内部控制与SOX合规要求。</div>
                      <div className="ac-link"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>查看财务优化模块</div>
                    </div>
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
