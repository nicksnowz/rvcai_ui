import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

function getStorage() {
  if (typeof window === 'undefined') return null;
  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    return null;
  }
  return storage;
}

function getSavedLang() {
  try {
    return getStorage()?.getItem('rvc-lang') || 'en';
  } catch {
    return 'en';
  }
}

const savedLang = getSavedLang();

i18n
  .use(initReactI18next)
  .init({
    resources: { zh: { translation: zh }, en: { translation: en } },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  try {
    getStorage()?.setItem('rvc-lang', lng);
  } catch {
    // Ignore unavailable storage, such as SSR or restricted browser contexts.
  }
  if (typeof document !== 'undefined') {
    const htmlRoot = document.getElementById('html-root');
    if (htmlRoot) {
      htmlRoot.setAttribute('lang', lng === 'zh' ? 'zh-CN' : 'en');
    }
  }
});

export default i18n;
