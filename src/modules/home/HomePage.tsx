'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FakeWindow } from './FakeWindow';
import './home.css';

const MODEL_LOGOS = [
  { name: 'ChatGPT', className: 'is-chatgpt' },
  { name: 'Gemini', className: 'is-gemini' },
  { name: 'Claude', className: 'is-claude' },
  { name: 'Grok', className: 'is-grok' },
  { name: 'Mistral', className: 'is-mistral' },
  { name: 'Perplexity', className: 'is-perplexity' },
] as const;

const STATS = [
  { value: '11', caption: 'guided fields per topic' },
  { value: '4', caption: 'output formats' },
  { value: '0', caption: 'blank sections, ever' },
] as const;

const WHY_CARDS = [
  {
    icon: <PuzzleIcon />,
    title: 'Every section, every time',
    copy: 'Skip a field and ES Markdown fills it with a sensible default instead of leaving a gap. Answer 5 of 11 fields, still get a complete document.',
  },
  {
    icon: <EyeIcon />,
    title: 'See it build, live',
    copy: 'The Markdown preview updates as you type — real formatting or plain text, your call. No surprise when you finally hit copy.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Guardrails baked in',
    copy: "Every output closes with an instruction to ask before guessing, and three ready-made follow-ups for when the first answer isn't quite right.",
  },
] as const;

const FACTS = [
  {
    key: '#1',
    strong: 'Markdown is the most common structuring format',
    rest: ' in the instruction-tuning data used to train modern chat models — headings and lists map directly to how they were taught to parse intent.',
  },
  {
    key: '↓',
    strong: 'Clear section headers reduce ambiguity',
    rest: ' — models answer the "## Constraints" block differently than a constraint buried mid-paragraph.',
  },
  {
    key: '⇄',
    strong: 'It round-trips cleanly',
    rest: ' between chat, docs, and code — the same file works as a prompt, a SKILL.md, or a README with no reformatting.',
  },
] as const;

const TESTIMONIALS = [
  {
    category: 'Developer',
    quote: (
      <>
        I used to keep a <code className="testimonial-code">prompt-template.md</code>{' '}
        I&apos;d copy-paste and hand-edit every time. This is that file, except it fills
        itself in and never lets me forget the guardrail section.
      </>
    ),
    initials: 'NT',
    avatarClass: 'is-pink',
    name: 'Nut T.',
    role: 'Backend developer, fintech',
  },
  {
    category: 'Power AI user',
    quote: (
      <>
        The default values are the real feature. I can see exactly what gets filled in if
        I skip a field — so leaving something blank never feels like a gamble.
      </>
    ),
    initials: 'PW',
    avatarClass: 'is-blue',
    name: 'Ploy W.',
    role: 'Daily Claude + GPT user',
  },
  {
    category: 'AI engineer',
    quote: (
      <>
        We standardized our internal SKILL.md files on this. Junior folks who&apos;ve
        never hand-rolled a system prompt now ship ones with the same structure as our
        senior agents.
      </>
    ),
    initials: 'KS',
    avatarClass: 'is-gold',
    name: 'Kritt S.',
    role: 'ML platform engineer',
  },
] as const;

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

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/markdown');
  }

  return (
    <div className="home">
      {/* ===== Hero ===== */}
      <section className="home-hero">
        <div className="home-container home-hero-grid">
          <div>
            <div className="home-eyebrow-row">
              <span className="home-eyebrow-dot" aria-hidden="true" />
              <span className="home-eyebrow">Form in, Markdown out</span>
            </div>
            <h1 className="home-h1">
              You know what
              <br />
              you need. <em>Typing it</em>
              <br />
              is the hard part.
            </h1>
            <p className="home-hero-sub">
              Answer a few plain questions — ES Markdown assembles the headings,
              guardrails, and structure AI models actually parse well. No blank page, no
              forgotten section.
            </p>

            <form className="home-cta-pill" onSubmit={handleGenerate}>
              <input
                type="text"
                className="home-cta-input"
                placeholder={'What are you building? e.g. "landing page for a coffee roastery"'}
                aria-label="What are you building?"
              />
              <button type="submit" className="home-cta-button">
                Generate →
              </button>
            </form>
            <div className="home-kbd-row">
              <span>
                <kbd className="home-kbd">⌘K</kbd> to jump in anywhere
              </span>
              <span>Website · Data summary · Agent instruction · Proposal</span>
            </div>

            <div className="home-stats">
              {STATS.map(({ value, caption }) => (
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
      <section className="home-logos" aria-label="Supported AI models">
        <p className="home-logos-caption">Formatted for the models you already use</p>
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
            <span className="home-eyebrow">Why ES Markdown</span>
            <h2 className="home-h2">
              The gap isn&apos;t your first prompt. It&apos;s the follow-up you never
              send.
            </h2>
            <p className="home-why-lede">
              General users get one shot and stop at &quot;okay, thanks.&quot; Power
              users iterate. We close that gap by writing the structure for you — and
              handing you the follow-ups too.
            </p>
          </div>
          <div className="home-why-grid">
            {WHY_CARDS.map(({ icon, title, copy }) => (
              <div key={title} className="home-why-card">
                <div className="home-why-icon">{icon}</div>
                <h3 className="home-why-card-title">{title}</h3>
                <p className="home-why-card-copy">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Did you know ===== */}
      <section className="home-facts">
        <div className="home-container">
          <div className="home-facts-slab">
            <div>
              <span className="home-eyebrow">Did you know</span>
              <h2 className="home-facts-headline">
                AI models don&apos;t just <span>tolerate</span> Markdown.
                <br />
                They were trained to <span>expect</span> it.
              </h2>
            </div>
            <div className="home-facts-list">
              {FACTS.map(({ key, strong, rest }) => (
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
            <span className="home-eyebrow">From people who write prompts for a living</span>
            <h2 className="home-h2">What builders, power users, and engineers say</h2>
          </div>
          <div className="home-testimonials-grid">
            {TESTIMONIALS.map(({ category, quote, initials, avatarClass, name, role }) => (
              <div key={name} className="testimonial-card">
                <span className="testimonial-pill">{category}</span>
                <p className="testimonial-quote">{quote}</p>
                <div className="testimonial-person">
                  <div className={`testimonial-avatar ${avatarClass}`} aria-hidden="true">
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
            ES Markdown — write once, format for none.
          </div>
          <nav className="home-footer-links" aria-label="Footer">
            <Link href="/markdown">Markdown</Link>
            <Link href="/agentic">Agentic</Link>
            <a href="#">GitHub</a>
            <a href="#">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
