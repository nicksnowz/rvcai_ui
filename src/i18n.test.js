import i18n from './i18n';

describe('i18n', () => {
  beforeEach(() => {
    if (typeof window.localStorage?.clear === 'function') {
      window.localStorage.clear();
    }
  });

  it('initialises with en as default language', () => {
    expect(i18n.language).toBe('en');
  });

  it('changes language to en', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
  });

  it('translates a nav key in zh', async () => {
    await i18n.changeLanguage('zh');
    expect(i18n.t('nav.overview')).toBe('概览');
  });

  it('translates a nav key in en', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.overview')).toBe('Overview');
  });
});
