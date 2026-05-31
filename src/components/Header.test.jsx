import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Header from './Header';

function renderHeader(activePath = '/') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[activePath]}>
        <Header mobileNavOpen={false} onHamburgerClick={() => {}} />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh');
  });

  it('renders all 5 nav links', () => {
    renderHeader();
    expect(screen.getByText('概览')).toBeInTheDocument();
    expect(screen.getByText('数据采集')).toBeInTheDocument();
    expect(screen.getByText('诊断报告')).toBeInTheDocument();
    expect(screen.getByText('执行模块')).toBeInTheDocument();
    expect(screen.getByText('IPO就绪')).toBeInTheDocument();
  });

  it('renders language toggle button showing EN when language is zh', async () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /switch language/i })).toHaveTextContent('EN');
  });

  it('switches to en when toggle is clicked', async () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: /switch language/i });
    fireEvent.click(toggle);
    expect(i18n.language).toBe('en');
  });
});
