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

const MOD_STATICS = [
  {
    id: 'ipo', category: 'capital', topClass: 'top-ipo', featured: true,
    color: '#0B6FFB', iconBg: 'rgba(11,111,251,0.10)', ringTrack: 'rgba(11,111,251,0.1)',
    dashOffset: 8.3, pct: '96%', pctColor: '#0B6FFB', featureDotColor: '#0B6FFB',
    tagClasses: ['tag tag-blue', 'tag tag-green'],
    tagStyles: [undefined, undefined],
    kpis: ['96%', '$42B', '320+'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#0B6FFB' }}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="22 20 2 20" />
      </svg>
    ),
  },
  {
    id: 'fin', category: 'financial', topClass: 'top-fin', featured: false,
    color: '#16B364', iconBg: 'rgba(22,179,100,0.10)', ringTrack: 'rgba(22,179,100,0.1)',
    dashOffset: 8.3, pct: '94%', pctColor: '#16B364', featureDotColor: '#16B364',
    tagClasses: ['tag tag-green'],
    tagStyles: [undefined],
    kpis: ['94%', '$8.2B', 'Big4'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#16B364' }}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'ma', category: 'strategy', topClass: 'top-ma', featured: false,
    color: '#23B7FF', iconBg: 'rgba(35,183,255,0.10)', ringTrack: 'rgba(35,183,255,0.1)',
    dashOffset: 12.5, pct: '91%', pctColor: '#23B7FF', featureDotColor: '#23B7FF',
    tagClasses: ['tag'],
    tagStyles: [{ background: 'rgba(35,183,255,0.1)', color: '#0B6FFB' }],
    kpis: ['91%', '$280M+', '186+'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#23B7FF' }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'ai', category: 'technology', topClass: 'top-ai', featured: false,
    color: '#7C3AED', iconBg: 'rgba(138,43,226,0.08)', ringTrack: 'rgba(124,58,237,0.1)',
    dashOffset: 15.2, pct: '89%', pctColor: '#7C3AED', featureDotColor: '#7C3AED',
    tagClasses: ['tag'],
    tagStyles: [{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }],
    kpis: ['89%', '3.2x', '180天'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#7C3AED' }}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'cap', category: 'capital', topClass: 'top-cap', featured: false,
    color: '#F59E0B', iconBg: 'rgba(245,158,11,0.10)', ringTrack: 'rgba(245,158,11,0.1)',
    dashOffset: 18, pct: '87%', pctColor: '#D97706', featureDotColor: '#D97706',
    tagClasses: ['tag tag-orange'],
    tagStyles: [undefined],
    kpis: ['87%', '4–8周', 'CIM+'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#D97706' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'inv', category: 'capital', topClass: 'top-inv', featured: false,
    color: '#F04438', iconBg: 'rgba(240,68,56,0.06)', ringTrack: 'rgba(240,68,56,0.1)',
    dashOffset: 21.7, pct: '84%', pctColor: '#F04438', featureDotColor: '#F04438',
    tagClasses: ['tag tag-red'],
    tagStyles: [undefined],
    kpis: ['84%', '320+', '186+'],
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: '#F04438' }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
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

  const MODULES = useMemo(() => {
    const texts = t('modules.mods', { returnObjects: true });
    return MOD_STATICS.map((s, i) => {
      const tx = texts[i];
      return {
        ...s,
        num: tx.num,
        title: tx.title,
        desc: tx.desc,
        tags: tx.tags.map((tag, j) => ({
          className: s.tagClasses[j] || 'tag',
          style: s.tagStyles[j],
          text: tag.text,
        })),
        features: tx.features,
        footMeta: { label: tx.footLabel, strong: tx.footStrong, extra: tx.footExtra },
        detail: { sub: tx.detailSub, kpis: tx.kpis || s.kpis, items: tx.detailItems },
      };
    });
  }, [t]);

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
  }, [activeFilter, searchQuery, MODULES]);

  const openDetail = (mod) => {
    setModalModule(mod);
    setModalOpen(true);
  };
  const closeDetail = () => setModalOpen(false);

  return (
    <div className="page light-theme">
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
              <div><div className="stat-val">{t('modules.stat3Val')}</div><div className="stat-lbl">{t('modules.stat3Lbl')}</div></div>
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
                      <div className="prog-label">{t('modules.matchLabel')}</div>
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
