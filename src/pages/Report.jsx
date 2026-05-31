import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/report.css';

const SIDEBAR_SCORES = [
  { name: '战略与增长', val: 74, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { name: '财务健康', val: 70, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { name: '运营效率', val: 63, color: '#F59E0B', grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
  { name: '治理合规', val: 58, color: '#F59E0B', grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
  { name: '组织人才', val: 65, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
  { name: '技术数据', val: 71, color: '#0B6FFB', grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
];

const SIDEBAR_LINKS = [
  { label: '综合评分', icon: (<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>) },
  { label: '雷达图分析', icon: (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />) },
  { label: '资本路径', icon: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>) },
  { label: '价值机会', icon: (<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />) },
  { label: '风险标记', icon: (<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />) },
  { label: '行动路线图', icon: (<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>) },
];

const OPPORTUNITIES = [
  { name: 'B端SaaS化——经销商管理系统订阅化', dim: '战略增长', dimTag: 'tag-blue', impact: '+$600万ARR', diff: '中 · 9个月' },
  { name: '库存周转优化（28天→20天）', dim: '运营效率', dimTag: 'tag-orange', impact: '释放$200万资金', diff: '低 · 3个月' },
  { name: '切换Big4审计——上市前置合规', dim: '治理合规', dimTag: 'tag-blue', impact: '解锁IPO路径', diff: '高 · 18个月' },
  { name: '车后服务延伸（维保/保险/金融）', dim: '战略增长', dimTag: 'tag-blue', impact: 'LTV提升3–4倍', diff: '高 · 18个月' },
  { name: '补充独立董事——完善治理结构', dim: '治理合规', dimTag: 'tag-blue', impact: '评分+14分', diff: '低 · 2个月' },
  { name: '数据资产商业化——AI定价SaaS输出', dim: '技术数据', dimTag: 'tag-blue', impact: '估值倍数扩张', diff: '中 · 6个月' },
];

const RISKS = [
  { name: '无Big4审计——IPO强制要求未达标', levelBg: 'rgba(240,68,56,0.1)', levelColor: '#F04438', level: '🔴 高', action: '立即启动Big4接触，最晚Q3签约' },
  { name: '治理结构薄弱——独立董事不足', levelBg: 'rgba(245,158,11,0.1)', levelColor: '#D97706', level: '⚠ 中', action: 'Q2前完成独立董事补充与审计委员会筹建' },
  { name: '数据安全合规缺口（PIPL/GDPR）', levelBg: 'rgba(245,158,11,0.1)', levelColor: '#D97706', level: '⚠ 中', action: '海外融资强制门槛，建议Q2启动合规体系建设' },
];

const ROADMAP = [
  { days: '30天', label: '首月基础', title: '合规启动', actions: ['接触3家Big4审计机构', '启动独立董事遴选', '库存周转优化启动', 'B端SaaS原型设计'] },
  { days: '60天', label: '治理完善', title: '结构升级', actions: ['完成独立董事聘任', '组建审计委员会', 'PIPL合规体系搭建', 'B轮路演材料准备'] },
  { days: '90天', label: '增长提速', title: '价值放大', actions: ['Big4审计正式签约', 'B端SaaS内测上线', '车后服务试点启动', '美元基金对接启动'] },
  { days: '180天', label: '资本就绪', title: '融资攻坚', actions: ['B轮Term Sheet谈判', 'IPO可行性评估报告', '2024年审计报告完成', '估值模型更新迭代'] },
];

export default function Report() {
  const { t } = useTranslation();
  const [activeSidebarLink, setActiveSidebarLink] = useState(0);

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
    <div className="page">
      <div className="report-page">
        <div className="report-wrap">
          <div className="breadcrumb reveal">
            <Link to="/">{t('report.breadcrumbHome')}</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--t2)', fontWeight: 500 }}>{t('report.breadcrumbCurrent')}</span>
          </div>

          {/* Header card */}
          <div className="report-head-card reveal">
            <div className="rhc-left">
              <div className="rhc-ey">{t('report.headEyebrow')}</div>
              <div className="rhc-co">UC Auto（优车汇）</div>
              <div className="rhc-meta">
                <span className="rhc-mi">二手车交易平台 · B2B/B2C</span><span className="rhc-sep">·</span>
                <span className="rhc-mi">营收 $5,000万</span><span className="rhc-sep">·</span>
                <span className="rhc-mi">A轮 · 50人团队</span><span className="rhc-sep">·</span>
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
                <div className="rsb-av-avatar">余</div>
                <div className="rsb-av-name">余龙文博士</div>
                <div className="rsb-av-title">资本市场 · IPO专项顾问</div>
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
                      <div className="sb-trend" style={{ color: '#16B364' }}>↑ 较初测提升 +6</div>
                    </div>
                    <div className="sb">
                      <div className="sb-val" style={{ color: '#42526E' }}>59</div>
                      <div className="sb-name">{t('report.industryMedian')}</div>
                      <div className="sb-trend" style={{ color: '#6B7890' }}>汽车后市场 · A轮</div>
                    </div>
                    <div className="sb">
                      <div className="sb-val" style={{ color: '#16B364' }}>+9</div>
                      <div className="sb-name">{t('report.outperform')}</div>
                      <div className="sb-trend" style={{ color: '#16B364' }}>前28%分位</div>
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
                        <text x="150" y="22" textAnchor="middle" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">战略与增长</text>
                        <text x="256" y="94" textAnchor="start" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">财务健康</text>
                        <text x="256" y="210" textAnchor="start" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">运营效率</text>
                        <text x="150" y="285" textAnchor="middle" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">治理合规</text>
                        <text x="42" y="210" textAnchor="end" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">组织人才</text>
                        <text x="42" y="94" textAnchor="end" fill="#07132B" fontSize="9.5" fontWeight="700" fontFamily="Inter,sans-serif">技术数据</text>
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
                      <div className="pc-title">B轮融资 + 赴美上市筹备</div>
                      <div className="pc-desc">完成B轮（$3,000–5,000万）后启动美股IPO筹备，利用增长势能打开海外机构市场。</div>
                      <div className="pc-timeline">目标时间：24–36个月 · 目标估值 $3–5亿</div>
                    </div>
                    <div className="path-card">
                      <div className="pc-badge" style={{ color: '#16B364', background: 'rgba(22,179,100,0.08)' }}>{t('report.pathAlternative')}</div>
                      <div className="pc-title">战略并购（卖方）</div>
                      <div className="pc-desc">现有技术资产与B端网络对汽车集团、互联网平台具备强并购吸引力，EV估值约5–8×ARR。</div>
                      <div className="pc-timeline">目标：12–18个月 · 估值区间 $2.5–4亿</div>
                    </div>
                    <div className="path-card">
                      <div className="pc-badge" style={{ color: '#9AA6B8', background: 'rgba(154,166,184,0.1)' }}>{t('report.pathOption')}</div>
                      <div className="pc-title">港股IPO</div>
                      <div className="pc-desc">港股对汽车后市场赛道估值修复中，适合在国内监管环境更确定后择机启动。</div>
                      <div className="pc-timeline">目标：36个月以上 · 需先完善治理体系</div>
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
                      {OPPORTUNITIES.map(o => (
                        <tr key={o.name}>
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
                      {RISKS.map(r => (
                        <tr key={r.name}>
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
                  <Link to="/ipo" className="btn-sm">{t('report.viewIpoConsole')}</Link>
                </div>
                <div className="sec-card-body">
                  <div className="roadmap">
                    {ROADMAP.map(p => (
                      <div key={p.days} className="rm-phase">
                        <div className="rm-dot">{p.days}</div>
                        <div className="rm-phase-label">{p.label}</div>
                        <div className="rm-phase-title">{p.title}</div>
                        <div className="rm-actions">
                          {p.actions.map(a => (
                            <div key={a} className="rm-action">{a}</div>
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
