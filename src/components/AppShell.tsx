'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/theme/useTheme';
import { useLanguage } from '@/i18n/useLanguage';
import { getStrings } from '@/data/i18n';
import './AppShell.css';

const NAV_ITEMS = [
  { href: '/', key: 'home' },
  { href: '/markdown', key: 'markdown' },
  { href: '/editor', key: 'editor' },
  { href: '/agentic', key: 'agentic' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1v1.8M8 13.2V15M15 8h-1.8M2.8 8H1M13 3l-1.3 1.3M4.3 11.7 3 13M13 13l-1.3-1.3M4.3 4.3 3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 2.4 9 4.2a4.1 4.1 0 0 1 1.7 1l2-.5.9 1.7-1.4 1.4a4.2 4.2 0 0 1 0 2l1.4 1.4-.9 1.7-2-.5a4.1 4.1 0 0 1-1.7 1L8 14.6l-1-1.8a4.1 4.1 0 0 1-1.7-1l-2 .5-.9-1.7 1.4-1.4a4.2 4.2 0 0 1 0-2L2.4 5.8l.9-1.7 2 .5a4.1 4.1 0 0 1 1.7-1L8 2.4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { lang, setLanguage } = useLanguage();
  const strings = getStrings(lang);
  const shell = strings.shell;

  return (
    <div className="shell">
      <header className="shell-topbar">
        <div className="shell-brand">
          <span className="shell-logo" aria-hidden="true">
            M
          </span>
          {shell.brand}
        </div>
        <nav className="shell-nav" aria-label={shell.navAriaLabel}>
          {NAV_ITEMS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`shell-nav-item${isActive(pathname, href) ? ' is-active' : ''}`}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
            >
              {shell.nav[key]}
            </Link>
          ))}
        </nav>
        <div className="shell-actions">
          <div className="shell-lang" role="group" aria-label={shell.lang.label}>
            <button
              type="button"
              className={`shell-lang-seg${lang === 'en' ? ' is-active' : ''}`}
              aria-pressed={lang === 'en'}
              onClick={() => setLanguage('en')}
            >
              {shell.lang.en}
            </button>
            <button
              type="button"
              className={`shell-lang-seg${lang === 'th' ? ' is-active' : ''}`}
              aria-pressed={lang === 'th'}
              onClick={() => setLanguage('th')}
            >
              {shell.lang.th}
            </button>
          </div>
          <button
            type="button"
            className="shell-icon-btn"
            onClick={toggle}
            aria-label={theme === 'dark' ? shell.themeToggle.toLight : shell.themeToggle.toDark}
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button type="button" className="shell-icon-btn" aria-label={shell.settingsLabel}>
            <GearIcon />
          </button>
          <div className="shell-avatar" aria-hidden="true" />
        </div>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
