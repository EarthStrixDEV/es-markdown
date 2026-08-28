<div align="center">

# 🌸 ES Markdown

### Form in, Markdown out.

**You know what you need. _Typing it_ is the hard part.**

ES Markdown turns form answers into complete, well-structured Markdown instructions for AI —
every section present, every time, no matter how few fields you fill in.

[![Next.js](https://img.shields.io/badge/Next.js-15-0B1626?logo=nextdotjs&logoColor=F2A6C6)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-0B1626?logo=react&logoColor=F2A6C6)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-0B1626?logo=typescript&logoColor=F2A6C6)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-75%20passing-16233D?logo=vitest&logoColor=E8D48A)](#-testing)
[![No backend](https://img.shields.io/badge/backend-none%20%E2%9C%A8-16233D)](#-tech--architecture)

</div>

---

## 💡 The problem

Most people get poor results from AI not because they can't type — but because they
**don't know what a good instruction needs to contain**. The gap between power users and
everyone else isn't typing skill; it's knowing the structure.

ES Markdown closes that gap: the app owns the structure, you just answer what you know.
Skip a field and it's filled with a sensible, pre-written default — **never left blank,
never cut**. Every output closes with a fixed guardrail and three ready-made follow-up
messages for when the first answer isn't quite right.

## 🧩 The four modules

| Module | Route | What it does |
|---|---|---|
| 🏠 **Home** | `/` | What the app is, why Markdown, and where to start |
| 📝 **Markdown workspace** | `/markdown` | Guided 9-field form across 5 task topics → **Prompt `.md`** / **`SKILL.md`** / **Workflow `.md`** |
| ⌨️ **Markdown Editor** | `/editor` | Free-form editor: formatting toolbar, grouped undo/redo, live side-by-side preview |
| 🤖 **Agentic module** | `/agentic` | 11-field form (Identity / Behavior / Guardrails) → **`AGENT.md`** with YAML frontmatter |

### Markdown workspace
- **5 topics** — Software Engineering, Research & Brainstorm, Content & Script, Everyday tasks, and Create Agent (hands off to the Agentic module)
- Every field shows its **"If empty:" default** right under the input — leaving a field blank is never a gamble
- **Live preview** on every keystroke, with a "written X/9" completion meter
- Switch output format (Prompt / SKILL / Workflow) **without re-typing anything**
- In-session history: save, revisit, keep editing

### Markdown Editor
- Two panes: plain text left, rendered GFM preview right — synced live
- Full toolbar: block styles, bold/italic/strike/inline-code, three list types, link, image, table, quote, code block, divider
- **Grouped undo/redo** — one undo reverts one action, not one character
- Opens with a "Weekly Sync Notes" sample that exercises every rendering feature

### Agentic module
- 11 fields in 3 groups: **Identity · Behavior · Guardrails**
- **Safety-first defaults**: an untouched form still produces a complete `AGENT.md` whose
  tools default to `read-only` and whose rules require human sign-off before anything irreversible
- Live `AGENT.md` preview with YAML frontmatter (`name` slugified for Latin, Thai passes through as-is)
- Session sidebar for multiple agents + a static workflow-graph teaser (clearly labeled preview-only)

## 🎨 Design

Claymorphism in **dark navy · cream · light pink** — soft inset/outset shadows, generous radii.

- **Fraunces** for display, **Sora** for UI, **JetBrains Mono** for Markdown
- Full **light/dark themes** — follows your OS, remembers your manual choice
- Responsive from wide desktop down to phone widths
- Every color, shadow, and radius lives in a single token file: [`src/theme/tokens.css`](src/theme/tokens.css)

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — that's it. No environment variables, no database, no API keys.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Static export (`out/`) |
| `npm run test` | Vitest unit suite |
| `npm run lint` | Type check (`tsc --noEmit`) |

## 🏗 Tech & architecture

**Next.js 15 (App Router) · React 19 · TypeScript · vanilla CSS tokens · [marked](https://github.com/markedjs/marked) — no backend at all.**
The app is a pure static export; the only persistence is `localStorage` (theme), always
wrapped in try/catch so a blocked-storage browser still works fine.

```
src/
├─ app/          routes (/, /markdown, /editor, /agentic) + layout, fonts, theme bootstrap
├─ theme/        tokens.css (single source of design truth) · no-flash theme script
├─ components/   AppShell · MarkdownPreview · CopyButton · Field
├─ lib/          markdown renderer · template assembler · slugify · safe storage
├─ data/         i18n strings & defaults (EN, TH-ready) · topics · agent fields · templates
└─ modules/      home / editor / workspace / agentic — one folder per module
```

The heart of the app is [`src/lib/assembler.ts`](src/lib/assembler.ts): a pure function
that resolves every section as *user input → else default*, so the output structure is
complete by construction — then appends the fixed guardrail, and (for Prompt format) the
three-message follow-up pack below a divider.

## ✅ Testing

75 unit tests (Vitest) covering the assembler (all four output formats, default
resolution, guardrail placement, Thai name passthrough), toolbar text transformations,
grouped undo/redo, and state reducers — plus a browser-driven QA pass against the spec's
acceptance criteria: [`docs/qa-checklist.md`](docs/qa-checklist.md).

## 🗺 Scope & roadmap

Deliberately **not** in v1: running prompts against a real AI (this app writes
instructions, it isn't a client), user accounts or cross-device history, a real
drag-and-drop workflow canvas, and automatic Thai→Latin name transliteration.

Next up: Thai UI/content (the i18n layer is already in place), the "Ask for a pattern"
assistant, and a blind test of the core hypothesis before investing further.

---

<div align="center">

**ES Markdown** — สร้างคำสั่ง AI ที่มีโครงสร้างครบ โดยไม่ต้องรู้ว่าโครงสร้างที่ดีหน้าตาเป็นอย่างไร

</div>
