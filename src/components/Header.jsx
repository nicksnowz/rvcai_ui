'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';

export default function Header({ mobileNavOpen, onHamburgerClick }) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  }

  return (
    <header>
      <div className="wrap hrow">
        <Link href="/" className="logo">
          <img src="/logo.png" alt="RVC" width="78" height="28" style={{ display: 'block' }} />
          <div className="logo-t">
            <span className="logo-n">RVC Capital</span>
            <span className="logo-s">{t('nav.logoSub')}</span>
          </div>
        </Link>
        <nav>
          {NAV_LINKS.map(({ to, key }) => (
            <Link key={to} href={to} className={pathname === to ? 'active' : undefined}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="hdr-acts">
          <button className="btn-ghost">{t('nav.login')}</button>
          <Link href="/intake" className="btn-primary">{t('nav.startDiagnosis')}</Link>
          <button
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={t('aria.langToggle')}
          >
            {t('langToggle')}
          </button>
        </div>
        <button
          className={`ham${mobileNavOpen ? ' open' : ''}`}
          id="ham"
          aria-label={t('aria.hamburger')}
          onClick={onHamburgerClick}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
