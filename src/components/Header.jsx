import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';

export default function Header({ mobileNavOpen, onHamburgerClick }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  }

  return (
    <header>
      <div className="wrap hrow">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="RVC" width="72" height="27" style={{ display: 'block', borderRadius: 4 }} />
          <div className="logo-t">
            <span className="logo-n">RVC Capital</span>
            <span className="logo-s">{t('nav.logoSub')}</span>
          </div>
        </Link>
        <nav>
          {NAV_LINKS.map(({ to, key }) => (
            <Link key={to} to={to} className={pathname === to ? 'active' : undefined}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="hdr-acts">
          <button className="btn-ghost">{t('nav.login')}</button>
          <Link to="/intake" className="btn-primary">{t('nav.startDiagnosis')}</Link>
          <button
            className="lang-toggle"
            onClick={toggleLang}
            aria-label="Switch language"
          >
            {t('langToggle')}
          </button>
        </div>
        <button
          className={`ham${mobileNavOpen ? ' open' : ''}`}
          id="ham"
          aria-label="菜单"
          onClick={onHamburgerClick}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
