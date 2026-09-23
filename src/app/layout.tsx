import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono, Noto_Sans_Thai } from 'next/font/google';
import { ThemeScript } from '@/theme/theme-script';
import { LangScript } from '@/i18n/lang-script';
import { AppShell } from '@/components/AppShell';
import '@/theme/tokens.css';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: 'variable',
  variable: '--font-noto-thai',
});

export const metadata: Metadata = {
  title: 'ES Markdown',
  description:
    'Turn form answers into complete, AI-ready Markdown briefs — every section always filled.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} ${notoSansThai.variable}`}
    >
      <head>
        <ThemeScript />
        <LangScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
