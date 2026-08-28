'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStrings } from '@/data/i18n';
import type { Locale } from '@/data/i18n/types';
import { useLanguage } from '@/i18n/useLanguage';
import { FakeWindow } from './FakeWindow';
import './home.css';

/* Proper nouns — brand names stay hardcoded, they don't localize. */
const MODEL_LOGOS = [
  { name: 'ChatGPT', className: 'is-chatgpt' },
  { name: 'Gemini', className: 'is-gemini' },
  { name: 'Claude', className: 'is-claude' },
  { name: 'Grok', className: 'is-grok' },
  { name: 'Mistral', className: 'is-mistral' },
  { name: 'Perplexity', className: 'is-perplexity' },
] as const;

/*
 * Presentation-only companions to the dictionary arrays (same order):
 * feature-card icons, testimonial avatar tints, and the per-locale emphasis
 * substrings (<em>/<span>/<code> wrapping stays in the component — the
 * dictionary holds plain text, per the types.ts doc comments).
 */
const WHY_ICONS = [PuzzleIcon, EyeIcon, ShieldIcon] as const;
const TESTIMONIAL_AVATARS = ['is-pink', 'is-blue', 'is-gold'] as const;
const HERO_EM: Record<Locale, string> = { en: 'Typing it', th: 'แค่พิมพ์' };
const FACT_EMPHASIS: Record<Locale, readonly string[]> = {
  en: ['tolerate', 'expect'],
  th: ['อ่าน', 'คาดหวัง'],
};
/** Filename kept literal in every locale's testimonial quote. */
const TESTIMONIAL_CODE_TOKEN = 'prompt-template.md';

/** Wrap the first occurrence of `token` in `text` with `render(token)`. */
function wrapToken(
  text: string,
  token: string,
  render: (token: string) => React.ReactNode,
): React.ReactNode {
  const i = text.indexOf(token);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      {render(token)}
      {text.slice(i + token.length)}
    </>
  );
}

/** Split on `\n` and render each line via `mapLine`, joined with <br />. */
function renderLines(
  text: string,
  mapLine: (line: string) => React.ReactNode,
): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {mapLine(line)}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

function PuzzleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M8.5 3.5h-4a1 1 0 0 0-1 1v4h1.75a1.75 1.75 0 1 1 0 3.5H3.5v4a1 1 0 0 0 1 1h4v-1.75a1.75 1.75 0 1 1 3.5 0V17h4a1 1 0 0 0 1-1v-4h1.25a1.75 1.75 0 1 0 0-3.5H17v-4a1 1 0 0 0-1-1h-4v1.25a1.75 1.75 0 1 1-3.5 0V3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M2 11s3.3-5.5 9-5.5S20 11 20 11s-3.3 5.5-9 5.5S2 11 2 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 2.5 4 5v5c0 4.4 3 8.1 7 9.5 4-1.4 7-5.1 7-9.5V5l-7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m8 11 2.2 2.2L14.5 8.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const strings = getStrings(lang);
  const home = strings.home;

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/markdown');
  }

  const heroEm = HERO_EM[strings.locale];
  const factEmphasis = FACT_EMPHASIS[strings.locale];

  return (
    <div className="home">
      {/* ===== Hero ===== */}
      <section className="home-hero">
        <div className="home-container home-hero-grid">
          <div>
            <div className="home-eyebrow-row">
              <span className="home-eyebrow-dot" aria-hidden="true" />
              <span className="home-eyebrow">{home.hero.eyebrow}</span>
            </div>
            <h1 className="home-h1">
              {renderLines(home.hero.title, (line) =>
                wrapToken(line, heroEm, (t) => <em>{t}</em>),
              )}
            </h1>
            <p className="home-hero-sub">{home.hero.sub}</p>

            <form className="home-cta-pill" onSubmit={handleGenerate}>
              <input
                type="text"
                className="home-cta-input"
                placeholder={home.hero.ctaPlaceholder}
                aria-label={home.hero.ctaAriaLabel}
              />
              <button type="submit" className="home-cta-button">
                {home.hero.ctaButton}
              </button>
            </form>
            <div className="home-kbd-row">
              <span>
                <kbd className="home-kbd">{home.hero.kbd}</kbd> {home.hero.kbdHint}
              </span>
              <span>{home.hero.exampleFormats}</span>
            </div>

            <div className="home-stats">
              {home.stats.map(({ value, caption }) => (
                <div key={caption}>
                  <div className="home-stat-value">{value}</div>
                  <div className="home-stat-caption">{caption}</div>
                </div>
              ))}
            </div>
          </div>

          <FakeWindow />
        </div>
      </section>

      {/* ===== Logo strip ===== */}
      <section className="home-logos" aria-label={home.logosAriaLabel}>
        <p className="home-logos-caption">{home.logosCaption}</p>
        <div className="home-logos-mask">
          <div className="home-logos-track">
            {[false, true].map((isClone) => (
              <div
                key={isClone ? 'clone' : 'original'}
                className="home-logos-group"
                aria-hidden={isClone || undefined}
              >
                {MODEL_LOGOS.map(({ name, className }) => (
                  <div key={name} className="home-logo-item">
                    <span className={`home-logo-mark ${className}`} aria-hidden="true" />
                    {name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why ES Markdown ===== */}
      <section className="home-why">
        <div className="home-container">
          <div className="home-why-intro">
            <span className="home-eyebrow">{home.why.eyebrow}</span>
            <h2 className="home-h2">{home.why.heading}</h2>
            <p className="home-why-lede">{home.why.lede}</p>
          </div>
          <div className="home-why-grid">
            {home.featureCards.map(({ title, copy }, i) => {
              const Icon = WHY_ICONS[i] ?? PuzzleIcon;
              return (
                <div key={title} className="home-why-card">
                  <div className="home-why-icon">
                    <Icon />
                  </div>
                  <h3 className="home-why-card-title">{title}</h3>
                  <p className="home-why-card-copy">{copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Did you know ===== */}
      <section className="home-facts">
        <div className="home-container">
          <div className="home-facts-slab">
            <div>
              <span className="home-eyebrow">{home.facts.eyebrow}</span>
              <h2 className="home-facts-headline">
                {renderLines(home.facts.headline, (line) => {
                  const token = factEmphasis.find((t) => line.includes(t));
                  return token
                    ? wrapToken(line, token, (t) => <span>{t}</span>)
                    : line;
                })}
              </h2>
            </div>
            <div className="home-facts-list">
              {home.facts.items.map(({ key, strong, rest }) => (
                <div key={key} className="home-fact-row">
                  <div className="home-fact-key" aria-hidden="true">
                    {key}
                  </div>
                  <p className="home-fact-copy">
                    <strong>{strong}</strong>
                    {rest}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="home-testimonials">
        <div className="home-container">
          <div className="home-testimonials-intro">
            <span className="home-eyebrow">{home.testimonials.eyebrow}</span>
            <h2 className="home-h2">{home.testimonials.heading}</h2>
          </div>
          <div className="home-testimonials-grid">
            {home.testimonials.items.map(({ category, quote, initials, name, role }, i) => (
              <div key={name} className="testimonial-card">
                <span className="testimonial-pill">{category}</span>
                <p className="testimonial-quote">
                  {wrapToken(quote, TESTIMONIAL_CODE_TOKEN, (t) => (
                    <code className="testimonial-code">{t}</code>
                  ))}
                </p>
                <div className="testimonial-person">
                  <div
                    className={`testimonial-avatar ${TESTIMONIAL_AVATARS[i] ?? 'is-pink'}`}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{name}</div>
                    <div className="testimonial-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-footer-logo" aria-hidden="true">
              M
            </span>
            {home.footer.tagline}
          </div>
          <nav className="home-footer-links" aria-label={home.footer.ariaLabel}>
            <Link href="/markdown">{home.footer.links.markdown}</Link>
            <Link href="/agentic">{home.footer.links.agentic}</Link>
            <a href="#">{home.footer.links.github}</a>
            <a href="#">{home.footer.links.privacy}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
