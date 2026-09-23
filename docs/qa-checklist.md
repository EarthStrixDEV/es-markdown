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
- ~~☑ Workflow graph section visibly carries the badge "Preview only — not saved, not linked to this form"~~ — *obsolete: the workflow graph was removed on 2026-09-23 (see Round 2)*

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
- **Thai agent names are not transliterated** — passthrough is the documented v1 behaviour (spec §4 known limitations)
- **No cross-session/cross-device persistence** — history and agents live in the current session only; only theme (and later language) persist in localStorage
- **No real AI execution in-app** — output is copy-out only
- **Editor "Save to history"** is an acknowledged stub ("Saved (session)" flash only; persistence noted in code as landing with a later round) — editor history is not a spec §3 acceptance criterion

## Minor observations (non-blocking, informational)

- Clipboard content arrives with CRLF line endings on Windows (OS-level conversion); markdown content is otherwise byte-identical to the preview
- Settings gear button in the top bar is decorative (no action wired) — consistent with wireframe scope

---

# Round 2 — Studio module, theme change, graph removal

- **Date:** 2026-09-23
- **Tester:** Min-Ju (manual pass in Chrome via Claude in Chrome) — `http://localhost:3001` dev server
- **Changes under test:**
  - The theme is now ResumeLoka-derived: indigo primary, Space Grotesk / Inter / IBM Plex Mono.
  - New Studio module at `/studio`.
  - The Editor toolbar and undo were extracted to `src/components/MarkdownEditPane`.
  - The Agentic workflow graph was removed.

## Automated gates

| Check | Result |
|---|---|
| `npm run lint` (tsc) | ☑ no errors |
| `npm run test` (Vitest) | ☑ 10 files, 112/112 tests passed |
| `npm run build` (static export) | ☑ passed, `/studio` exported as a static route |

## Studio (`/studio`) — PASS (partial, see untested)

- ☑ Studio nav item appears after Agentic and routes to `/studio`
- ☑ 11 prompt types are listed in the sidebar; Code shows its type-specific fields
- ☑ Switching to Image with a Task value recomputes the output; JSON contains `"type": "image"` and the typed task
- ☑ Editing the JSON pane locks the form, shows the "form is locked" banner with "Regenerate from form", and puts stale dots on the Plain and Markdown tabs
- ☑ Invalid JSON edit shows an inline `Invalid JSON: …` line; editing still works
- ☑ Save to history → reload → the entry persists (localStorage); clicking it restores type, values, and locked state
- ☑ Light and dark themes render correctly

## Editor regression after toolbar extraction — PASS

- ☑ Bold on a selected word wraps it in `**…**`; Ctrl+Z reverts it; Ctrl+Shift+Z redoes it

## Agentic — PASS

- ☑ Workflow graph section is gone; the form and the `AGENT.md` preview still render

## Not tested in this round

- The Regenerate confirm dialog, in the browser (`window.confirm` can't be driven by the tool; the reducer logic is unit-tested)
- 9 of the 11 Studio types were not opened individually (only Code and Image were)
- Mobile / narrow widths

## Open issues found

1. **Home → Workspace loses the typed text:** the hero input value is not carried into "What should be built or fixed?"; the form arrives empty (0/9).
2. **Workspace SKILL.md Formatted view renders the YAML frontmatter as a large heading** instead of a code block (the Agentic `AGENT.md` view renders it correctly).
3. **The Agentic preview header is cramped:** "Plain text" wraps to two lines and the file name is truncated.
4. **"If empty:" hints for list fields run together:** newline-separated defaults such as Constraints display as one sentence. The cause is the shared `Field` component.

## Known gaps update

- The Studio history persists in localStorage (max 50 entries). Workspace and Agentic history is still session-only.
- Studio media guardrail and follow-up copy, and the per-type defaults, are authored and pending P'Earth's content review (`src/data/studio/en.ts`).
