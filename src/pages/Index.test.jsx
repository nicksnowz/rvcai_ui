import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Index from './Index';

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function renderIndex() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('Index hero with video backdrop', () => {
  it('renders the video backdrop and typewriter headline inside the hero', () => {
    const { container } = renderIndex();
    const hero = container.querySelector('section.hero');
    expect(hero).toBeInTheDocument();
    expect(hero.querySelector('.hero-h')).toBeInTheDocument();
    expect(hero.querySelector('video')).toBeInTheDocument();
  });

  it('relocates the engine SVG into its own section below the hero', () => {
    const { container } = renderIndex();
    const hero = container.querySelector('section.hero');
    const engineSection = container.querySelector('section.engine-section');
    expect(engineSection).toBeInTheDocument();
    expect(engineSection.querySelector('#n1')).toBeInTheDocument();
    expect(hero.querySelector('#n1')).toBeNull();
  });
});
