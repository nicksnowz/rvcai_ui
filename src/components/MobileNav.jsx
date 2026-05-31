import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { to: '/', key: 'nav.overview' },
  { to: '/intake', key: 'nav.intake' },
  { to: '/report', key: 'nav.report' },
  { to: '/modules', key: 'nav.modules' },
  { to: '/ipo', key: 'nav.ipo' },
];

export default function MobileNav({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
    onClose();
  }

  return (
    <div className={`mob-nav${open ? ' open' : ''}`} id="mob-nav">
      {NAV_LINKS.map(({ to, key }) => (
        <Link
          key={to}
          to={to}
          className={pathname === to ? 'active' : undefined}
          onClick={onClose}
        >
          {t(key)}
        </Link>
      ))}
      <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
        {t('langToggle')}
      </button>
    </div>
  );
}
