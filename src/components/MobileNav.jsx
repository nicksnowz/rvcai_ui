import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';

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
      <button className="lang-toggle" onClick={toggleLang} aria-label={t('aria.langToggle')}>
        {t('langToggle')}
      </button>
    </div>
  );
}
