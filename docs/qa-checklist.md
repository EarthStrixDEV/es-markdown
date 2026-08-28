# ES Markdown — QA Checklist (v1 initial scaffold)

- **Date:** 2026-08-28
- **Tester:** Prae (QA Lead) — independent functional pass against `specification.md` §2–§5
- **Environment:** Windows 11 Pro · Chromium 151.0.7922.34 (Playwright 1.62.1, headless) · Next.js 15.5.24 dev server, `http://localhost:3000`
- **Method:** Real browser interaction (typing, clicking, keyboard shortcuts, reloads, blocked-storage context) with assertions on live DOM/preview content — no code fixes made during this pass.

## Automated gates

| Check | Result |
|---|---|
| `npm run test` (Vitest) | ☑ 7 files, 75/75 tests passed |
| `npm run build` (static export) | ☑ Compiled + exported 7 routes, no errors |

## §3 Markdown Editor (`/editor`) — PASS

- ☑ Typing `**bold**` in the left pane renders `<strong>bold</strong>` on the right with no button press
- ☑ Typing `# Header One` renders an `<h1>` live
- ☑ Typing a GFM table (`| a | b |` + separator + row) renders a real `<table>` with cells live
- ☑ Select a word → click **Bold**: textarea value becomes `please embolden **word** here`; selection stays on the wrapped word (sane caret/selection after action)
- ☑ Grouped undo: typed a 13-char burst, pressed Ctrl+Z **once** → entire burst reverted (not one character)
- ☑ Toolbar action (Italic on selection) then Ctrl+Z → reverts exactly that one action, document back to prior state
- ☑ Initial load shows the "Weekly Sync Notes" sample with h2, bold (Attendees), italic, list, table, blockquote, and inline code all rendered correctly

## §2 Markdown Workspace (`/markdown`) — PASS

- ☑ Opening the module shows 9 form fields immediately
- ☑ Every field shows a gold "If empty: …" default hint — all 9 hints non-blank
- ☑ Filled only 3 fields → Plain-text preview contains **all** section headings (Goal / Context / Starting data / Requirements / Constraints / Output format / Quality bar + Audience/Avoid lines); every unfilled section carries DEF text, none empty
- ☑ Typed markers appear verbatim in the output
- ☑ Switch topic (Research & Brainstorm) → fields are separate (blank); switch back to Software Engineering → typed values still present
- ☑ Switch format Prompt → SKILL.md: typed content identical; structure changes (YAML frontmatter `name:` + "When to use" section)
- ☑ Guardrail section present in Prompt, SKILL.md, and Workflow .md outputs; in SKILL.md/Workflow it is the **final** section
- ☑ Prompt format **only** has `---` divider + follow-up warning + exactly 3 follow-up items below the guardrail (SKILL/Workflow verified to have none)
- ☑ Copy button places the full previewed markdown on the clipboard (verified via clipboard read; byte-identical after CRLF normalisation)
- ☑ Save to history creates a sidebar entry titled from the goal field; after editing a field, clicking the entry restores the saved values

## §4 Agentic module (`/agentic`) — PASS

- ☑ Brand-new agent, nothing typed → preview is a complete AGENT.md: frontmatter with `name:`, `description:`, `tools:`
- ☑ Frontmatter defaults to `tools: read-only`
- ☑ All 10 body sections present (Role, Instruction, Used when, Input, Tools, Steps, Boundaries & escalation, Voice, Output & handoff, Success criteria) — every one non-empty (DEF text)
- ☑ Body Tools section carries the strict default "read & search only — no send, no delete, no irreversible action"
- ☑ Typing Name `Support Bot` → frontmatter updates live to `name: support-bot` (Latin slugified)
- ☑ Typing Thai name `น้องช่วยงาน` → passed through verbatim as `name: น้องช่วยงาน` (known limitation, per spec — no auto-transliteration in v1)
- ☑ "+ New agent" starts blank and does **not** overwrite the first agent; switching between the two via the sidebar restores each agent's own Name/Role data
- ☑ Workflow graph section visibly carries the badge "Preview only — not saved, not linked to this form" (plus "Static preview — nodes and connections are illustrative only")

## §5 Global — PASS

- ☑ Theme toggle switches `data-theme` dark ↔ light
- ☑ Reload → theme persists (localStorage `esmd.theme`)
- ☑ Blocked storage: browser context with throwing `localStorage`/`sessionStorage` getters — all 4 routes load and render their main UI with **zero** console errors or page errors
- ☑ Static confirmation: all localStorage access goes through try/catch (`src/lib/storage.ts` safeGet/safeSet/safeRemove + inline no-flash script in `src/theme/theme-script.tsx`)
- ☑ Browser console clean (no errors, no warnings) on `/`, `/markdown`, `/editor`, `/agentic`

## Home (`/`) — PASS

- ☑ Hero CTA/search submit navigates to `/markdown`
- ☑ Top-nav links Home / Markdown / Editor / Agentic all route to the correct pages

## Result: 41/41 browser checks passed · 0 failures

## Known gaps (by design — do not file as bugs)

Per the plan's confirmed decisions and spec §7 non-goals:

- **Thai language deferred** — i18n structure exists but content is EN-only this round; the §5 TH/EN language toggle is therefore not present yet and was not tested
- **"Ask for a pattern" AI helper** — spec P1, explicitly cut from v1
- **Workflow graph is static by design** — no drag-and-drop, no persistence, no JSON export/import; correctly labelled as preview-only in the UI
- **Thai agent names are not transliterated** — passthrough is the documented v1 behaviour (spec §4 known limitations)
- **No cross-session/cross-device persistence** — history and agents live in the current session only; only theme (and later language) persist in localStorage
- **No real AI execution in-app** — output is copy-out only
- **Editor "Save to history"** is an acknowledged stub ("Saved (session)" flash only; persistence noted in code as landing with a later round) — editor history is not a spec §3 acceptance criterion

## Minor observations (non-blocking, informational)

- Clipboard content arrives with CRLF line endings on Windows (OS-level conversion); markdown content is otherwise byte-identical to the preview
- Settings gear button in the top bar is decorative (no action wired) — consistent with wireframe scope
