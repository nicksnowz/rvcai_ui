'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../config/nav';

export default function MobileNav({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
    onClose();
  }

  return (
    <div className={`mob-nav${open ? ' open' : ''}`} id="mob-nav">
      {NAV_LINKS.map(({ to, key }) => (
        <Link
          key={to}
          href={to}
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
