import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import { ThemeScript } from '@/theme/theme-script';
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
