import '../src/styles/rvc-base.css';
import '../src/styles/index.css';
import '../src/styles/intake.css';
import '../src/styles/report.css';
import '../src/styles/modules.css';
import '../src/styles/ipo.css';
import ClientProviders from './ClientProviders';
import NavWrapper from './NavWrapper';

export const metadata = {
  title: 'RVC Capital — Enterprise Value Diagnostic',
  description: 'AI-driven enterprise health check and capital-path execution platform.',
};

export default function RootLayout({ children }) {
  return (
    <html id="html-root">
      <body>
        <ClientProviders>
          <NavWrapper />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
