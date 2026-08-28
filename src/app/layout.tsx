import type { Metadata } from 'next';
import { Fraunces, Sora, JetBrains_Mono } from 'next/font/google';
import { ThemeScript } from '@/theme/theme-script';
import { AppShell } from '@/components/AppShell';
import '@/theme/tokens.css';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  weight: 'variable',
  variable: '--font-fraunces',
});

const sora = Sora({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sora',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-jetbrains-mono',
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
      className={`${fraunces.variable} ${sora.variable} ${jetbrainsMono.variable}`}
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
