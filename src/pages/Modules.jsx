import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/modules.css';

const FILTERS = [
  { key: 'all', labelKey: 'modules.filterAll' },
  { key: 'capital', labelKey: 'modules.filterCapital' },
  { key: 'financial', labelKey: 'modules.filterFinancial' },
  { key: 'strategy', labelKey: 'modules.filterStrategy' },
  { key: 'technology', labelKey: 'modules.filterTechnology' },
];

const MODULES = [
  {
    id: 'ipo',
    category: 'capital',
    topClass: 'top-ipo',
    featured: true,
    num: '模块 01',
    title: 'IPO就绪加速台',
    desc: '覆盖美股/港股上市全流程——从合规差距评估到承销商遴选、招股书起草与路演准备。',
    color: '#0B6FFB',
    iconBg: 'rgba(11,111,251,0.10)',
    ringTrack: 'rgba(11,111,251,0.1)',
    dashOffset: 8.3,
    pct: '96%',
    pctColor: '#0B6FFB',
    tags: [
      { className: 'tag tag-blue', text: '资本市场' },
      { className: 'tag tag-green', text: '强烈推荐' },
    ],
    features: [
      '监管合规差距分析与整改路线图',
      'Big4审计对接与财务报表规范化',
      '承销商路演 Deck 与投资者问答准备',
      '招股书（S-1/F-1）节点跟踪与里程碑管理',
    ],
    featureDotColor: '#0B6FFB',
    footMeta: { label: '周期：', strong: '18–24 个月', extra: ' · 320+ 顾问' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#0B6FFB' }}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="22 20 2 20" />
      </svg>
    ),
    detail: {
      sub: '资本市场 · 匹配度 96%',
      kpis: ['96%', '$42B', '320+'],
      items: ['监管合规差距分析与整改路线图', '财务报表规范化与Big4审计对接', '招股书（F-1/S-1）起草支持与SEC审核准备', '承销商遴选与路演策略制定', '投资者路演准备与模拟问答训练', '锁定期策略与上市后资本市场支持'],
    },
  },
  {
    id: 'fin',
    category: 'financial',
    topClass: 'top-fin',
    num: '模块 02',
    title: '财务健康深度审计',
    desc: '机构级财务建模、盈利质量分析与EBITDA优化，全面提升优车汇财务可信度与投资人吸引力。',
    color: '#16B364',
    iconBg: 'rgba(22,179,100,0.10)',
    ringTrack: 'rgba(22,179,100,0.1)',
    dashOffset: 8.3,
    pct: '94%',
    pctColor: '#16B364',
    tags: [{ className: 'tag tag-green', text: '财务优化' }],
    features: [
      '盈利质量（QoE）深度评估',
      '营运资本优化与核心财务KPI体系',
      '收入确认规范化与GAAP/IFRS对齐',
      '三表联动财务模型构建',
    ],
    featureDotColor: '#16B364',
    footMeta: { label: '周期：', strong: '3–6 个月', extra: ' · Big4 合作' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#16B364' }}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    detail: {
      sub: '财务优化 · 匹配度 94%',
      kpis: ['94%', '$8.2B', 'Big4'],
      items: ['盈利质量（QoE）深度评估报告', '营运资本优化与财务KPI仪表板', '收入确认规范化与GAAP/IFRS对齐', '三表联动财务模型及多情景预测', '税务结构优化与财务风险排查', '财务数据室（Data Room）构建'],
    },
  },
  {
    id: 'ma',
    category: 'strategy',
    topClass: 'top-ma',
    num: '模块 03',
    title: '战略并购优化',
    desc: 'AI辅助尽调、价值桥接分析与交易结构设计，加速优车汇的买方/卖方并购进程。',
    color: '#23B7FF',
    iconBg: 'rgba(35,183,255,0.10)',
    ringTrack: 'rgba(35,183,255,0.1)',
    dashOffset: 12.5,
    pct: '91%',
    pctColor: '#23B7FF',
    tags: [{ className: 'tag', style: { background: 'rgba(35,183,255,0.1)', color: '#0B6FFB' }, text: '战略并购' }],
    features: [
      '标的筛选与交易机会识别',
      'AI尽调自动化与风险红旗检测',
      '价值桥接分析与协同效应量化',
      '整合规划与百日执行路线图',
    ],
    featureDotColor: '#23B7FF',
    footMeta: { label: '周期：', strong: '6–18 个月', extra: ' · $2.8亿–4.3亿区间' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#23B7FF' }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    detail: {
      sub: '战略并购 · 匹配度 91%',
      kpis: ['91%', '$280M+', '186+'],
      items: ['并购标的系统化筛选与评级', 'AI驱动尽调自动化与红旗识别', '价值桥接分析与协同效应量化', '最优交易结构设计（股权/现金/混合）', '整合规划与百日执行路线图', '卖方CIM材料与数据室搭建'],
    },
  },
  {
    id: 'ai',
    category: 'technology',
    topClass: 'top-ai',
    num: '模块 04',
    title: 'AI智能化转型',
    desc: '针对二手车交易场景的AI战略规划与落地路线图，构建数据驱动的竞争护城河，重塑投资叙事。',
    color: '#7C3AED',
    iconBg: 'rgba(138,43,226,0.08)',
    ringTrack: 'rgba(124,58,237,0.1)',
    dashOffset: 15.2,
    pct: '89%',
    pctColor: '#7C3AED',
    tags: [{ className: 'tag', style: { background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }, text: '科技赋能' }],
    features: [
      'AI应用场景识别与ROI量化分析',
      '车辆定价引擎与库存智能调度升级',
      '车辆数据资产化与商业变现路径',
      'AI技术叙事融入投资人 Deck',
    ],
    featureDotColor: '#7C3AED',
    footMeta: { label: '周期：', strong: '3–9 个月', extra: ' · 估值乘数提升' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#7C3AED' }}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    detail: {
      sub: '科技赋能 · 匹配度 89%',
      kpis: ['89%', '3.2x', '180天'],
      items: ['二手车AI应用场景识别与ROI量化', '智能定价引擎与库存调度系统升级', '车辆数据资产化与变现路径规划', '技术栈现代化路线图', 'AI叙事融入投资人路演材料', '数字化运营能力评估与提升'],
    },
  },
  {
    id: 'cap',
    category: 'capital',
    topClass: 'top-cap',
    num: '模块 05',
    title: '资本叙事构建',
    desc: '基于诊断数据，构建机构级投资叙事——从保密信息备忘录（CIM）到路演材料，完整呈现优车汇价值。',
    color: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.10)',
    ringTrack: 'rgba(245,158,11,0.1)',
    dashOffset: 18,
    pct: '87%',
    pctColor: '#D97706',
    tags: [{ className: 'tag tag-orange', text: '资本市场' }],
    features: [
      '投资逻辑梳理与差异化定位',
      '保密信息备忘录（CIM）全套输出',
      '投资路演 Deck 与配套问答材料',
      '可比公司分析与估值定价基准',
    ],
    featureDotColor: '#D97706',
    footMeta: { label: '周期：', strong: '4–8 周', extra: ' · 数据驱动' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#D97706' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    detail: {
      sub: '资本市场 · 匹配度 87%',
      kpis: ['87%', '4–8周', 'CIM+'],
      items: ['投资逻辑梳理与差异化定位', '保密信息备忘录（CIM）全套输出', '投资路演Deck与配套问答材料', '可比公司分析与估值定价基准', '投资人关系策略规划', '融资材料多语言版本支持'],
    },
  },
  {
    id: 'inv',
    category: 'capital',
    topClass: 'top-inv',
    num: '模块 06',
    title: '精准投资人匹配',
    desc: 'AI精选机构投资人、PE基金与战略合作方，精准匹配优车汇企业画像与融资目标，缩短寻资周期。',
    color: '#F04438',
    iconBg: 'rgba(240,68,56,0.06)',
    ringTrack: 'rgba(240,68,56,0.1)',
    dashOffset: 21.7,
    pct: '84%',
    pctColor: '#F04438',
    tags: [{ className: 'tag tag-red', text: '机构网络' }],
    features: [
      '320+ 机构顾问网络专属接入',
      'AI匹配PE/VC基金，精准引荐',
      '战略收购方识别与背景分析',
      '关系维护与热线引荐跟进',
    ],
    featureDotColor: '#F04438',
    footMeta: { label: '网络：', strong: '320+ 顾问', extra: ' · 186+ 细分赛道' },
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#F04438' }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    detail: {
      sub: '机构网络 · 匹配度 84%',
      kpis: ['84%', '320+', '186+'],
      items: ['AI精选匹配机构投资人名单', 'PE/VC基金专属引荐与背景分析', '战略收购方识别与接触策略', '投资人关系维护与进度追踪', '热线引荐与会议安排支持', '融资过程全程顾问陪跑'],
    },
  },
];

export default function Modules() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalModule, setModalModule] = useState(null);

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

  const visibleModules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MODULES.filter(m => {
      if (activeFilter !== 'all' && m.category !== activeFilter) return false;
      if (!q) return true;
      const haystack = [
        m.num, m.title, m.desc,
        ...m.features,
        ...m.tags.map(tag => tag.text),
        m.footMeta.label + m.footMeta.strong + m.footMeta.extra,
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [activeFilter, searchQuery]);

  const openDetail = (mod) => {
    setModalModule(mod);
    setModalOpen(true);
  };
  const closeDetail = () => setModalOpen(false);

  return (
    <div className="page">
      <div className="modules-page">
        <div className="wrap">
          {/* Page header */}
          <div className="modules-header reveal">
            <div className="mh-left">
              <div className="mh-ey">{t('modules.eyebrow')}</div>
              <h1 className="mh-title">{t('modules.title')}</h1>
              <p className="mh-sub">{t('modules.subtitle')}</p>
            </div>
            <div className="mh-right">
              <span className="tag tag-blue"><span className="tag-dot" />{t('modules.readyTag')}</span>
              <button className="btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>
                {t('modules.viewPricing')}
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="stats-strip reveal">
            <div className="stat-card">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <div><div className="stat-val">6</div><div className="stat-lbl">{t('modules.stat1Lbl')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <div><div className="stat-val">89%</div><div className="stat-lbl">{t('modules.stat2Lbl')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div><div className="stat-val">18月</div><div className="stat-lbl">{t('modules.stat3Lbl')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-ico">
                <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <div><div className="stat-val">$42B+</div><div className="stat-lbl">{t('modules.stat4Lbl')}</div></div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="filter-bar reveal">
            {FILTERS.map((f, idx) => (
              <span key={f.key} style={{ display: 'contents' }}>
                <button
                  className={activeFilter === f.key ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {t(f.labelKey)}
                </button>
                {idx === 0 && <div className="filter-sep" />}
              </span>
            ))}
            <div className="filter-sep" />
            <div className="filter-search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder={t('modules.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Module Grid */}
          <div className="module-grid">
            {visibleModules.map(m => (
              <div
                key={m.id}
                className={`mod-card ${m.topClass}${m.featured ? ' featured' : ''} reveal`}
                onClick={() => openDetail(m)}
              >
                <div className="mod-card-top">
                  <div className="mod-ico-wrap">
                    <div className="mod-ico" style={{ background: m.iconBg }}>
                      {m.icon}
                    </div>
                    <div className="mod-tag-wrap">
                      {m.tags.map((tag, i) => (
                        <span key={i} className={tag.className} style={tag.style}>{tag.text}</span>
                      ))}
                    </div>
                  </div>
                  <div className="prog-ring">
                    <svg viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke={m.ringTrack} strokeWidth="5" />
                      <circle cx="28" cy="28" r="22" fill="none" stroke={m.color} strokeWidth="5"
                        strokeLinecap="round" strokeDasharray="138.2" strokeDashoffset={m.dashOffset}
                        transform="rotate(-90 28 28)" />
                    </svg>
                    <div className="prog-ring-center">
                      <div className="prog-pct" style={{ color: m.pctColor }}>{m.pct}</div>
                      <div className="prog-label">匹配</div>
                    </div>
                  </div>
                </div>
                <div className="mod-card-body">
                  <div className="mod-num">{m.num}</div>
                  <div className="mod-title">{m.title}</div>
                  <div className="mod-desc">{m.desc}</div>
                  <div className="mod-features">
                    {m.features.map((f, i) => (
                      <div key={i} className="mod-feat">
                        <div className="mod-feat-dot" style={{ background: m.featureDotColor }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mod-card-foot">
                  <div className="mod-foot-meta">
                    {m.footMeta.label}<strong>{m.footMeta.strong}</strong>{m.footMeta.extra}
                  </div>
                  <div className="mod-launch">{t('modules.launch')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel Overlay + Drawer */}
      <div
        className={modalOpen ? 'mod-detail-overlay open' : 'mod-detail-overlay'}
        onClick={closeDetail}
      />
      <div className={modalOpen ? 'mod-detail open' : 'mod-detail'}>
        {modalModule && (
          <>
            <div className="mod-detail-head">
              <button className="mdh-close" onClick={closeDetail}>
                <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                {t('modules.backToList')}
              </button>
              <div className="mdh-title">{modalModule.title}</div>
              <div className="mdh-sub">{modalModule.detail.sub}</div>
            </div>
            <div className="mod-detail-body">
              <div className="md-section">
                <div className="md-section-title">{t('modules.detailKpiTitle')}</div>
                <div className="md-kpi-row">
                  <div className="md-kpi">
                    <div className="md-kpi-val">{modalModule.detail.kpis[0]}</div>
                    <div className="md-kpi-lbl">{t('modules.detailKpi1')}</div>
                  </div>
                  <div className="md-kpi">
                    <div className="md-kpi-val">{modalModule.detail.kpis[1]}</div>
                    <div className="md-kpi-lbl">{t('modules.detailKpi2')}</div>
                  </div>
                  <div className="md-kpi">
                    <div className="md-kpi-val">{modalModule.detail.kpis[2]}</div>
                    <div className="md-kpi-lbl">{t('modules.detailKpi3')}</div>
                  </div>
                </div>
              </div>
              <div className="md-section">
                <div className="md-section-title">{t('modules.detailIncludes')}</div>
                <div>
                  {modalModule.detail.items.map((item, i) => (
                    <div key={i} className="md-item">
                      <div className="md-item-ico">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/ipo"
                  className="btn-blue"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px 20px', fontSize: '13px' }}
                >
                  {t('modules.openIpoConsole')}
                </Link>
                <button className="btn-outline" style={{ padding: '12px 20px', fontSize: '13px' }}>
                  {t('modules.bookAdvisor')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
