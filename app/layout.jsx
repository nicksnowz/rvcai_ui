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
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html id="html-root" lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ClientProviders>
          <NavWrapper />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
