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

---

## §5 Language Toggle (TH/EN) — 2026-08-28

- **Date:** 2026-08-28
- **Tester:** Prae (QA Lead) — independent functional pass against `specification.md` §5 (plus §2–§4 acceptance criteria that reference language-sensitive content)
- **Environment:** Windows 11 Pro · Chromium (Playwright 1.62.1, headless) · Next.js 15.5.24 dev server, `http://localhost:3000`
- **Method:** Real browser interaction via a standalone Playwright driver script (typing, real Tab/Enter/Space keyboard events, clicks, reloads, a blocked-storage browser context) with assertions on live DOM/`localStorage`/`aria-*`/computed-style state — no source files edited during this pass. The Chrome DevTools extension (`claude-in-chrome`) was unavailable in this environment ("not connected"); Playwright was used instead, matching the tooling named in the prior pass's header.

### Automated gates

| Check | Result |
|---|---|
| `npm run test -- --run` (Vitest) | ☑ 7 files, 75/75 tests passed |
| `npm run build` (static export) | ☑ Compiled + exported 7 routes, no errors |

### 1. Toggle control (visibility, keyboard, aria)

- ☑ Segmented `EN \| TH` toggle visible in the `AppShell` top bar, positioned immediately before the theme toggle button in `.shell-actions` DOM order
- ☑ Default state on load: `aria-pressed="true"` on EN segment, `="false"` on TH segment
- ☑ Real `Tab` key navigation (no `.focus()` shortcut) reaches the TH segment button
- ☑ Focused segment shows a visible focus ring (`outline: solid 2px`, not `none`)
- ☑ `Enter` on the focused TH segment activates it: `<html lang>` flips to `th`, `aria-pressed` flips on both segments
- ☑ `Space` on the focused EN segment activates it: `<html lang>` flips back to `en`
- ☑ Zero console errors/page errors during toggle interaction

### 2. Click TH on each route — all app-authored text switches

- ☑ `/` — nav labels (หน้าแรก/Markdown/Editor/Agentic), hero eyebrow + headline + subhead all switch to Thai simultaneously
- ☑ `/markdown` — `<html lang>` persists as `th` across client-side navigation; topic selector, form field labels, and the gold "ถ้าเว้นว่าง:" (If empty:) DEF hint prefix all render in Thai
- ☑ `/markdown` live preview — after typing into a field, preview shows Thai section headings (เป้าหมาย/บริบท/ข้อจำกัด), the Thai guardrail body text, and the Thai follow-up-pack heading ("ชุดข้อความต่อยอด") together in the Prompt format
- ☑ `/editor` — `<html lang>` persists; pane labels ("พรีวิวสด"), the "จัดรูปแบบ · ซิงก์แล้ว" pill, and toolbar button `aria-label`s (ตัวหนา/ตัวเอียง/ขีดฆ่า/ลิงก์/รูปภาพ/แทรกตาราง/... — 20 aria-labelled controls checked) all switch to Thai
- ☑ `/agentic` — `<html lang>` persists; all 3 form groups render correctly — `.ag-group-title` elements confirmed `["ตัวตน","พฤติกรรม","Guardrails"]` (Guardrails is intentionally identical in both locales per `src/data/i18n/th.ts` — a kept English technical term, not a miss); AGENT.md preview shows Thai section headings (บทบาท/คำสั่งหลัก) and frontmatter `tools: read-only` default
- ☑ Zero console errors across all 4 route switches

*Tooling note: one assertion in my driver script used Playwright's `body.innerText()`, which — being layout-aware — did not return text positioned below the default 720px headless viewport height (the Guardrails group renders at `y:1095`, fully `display:block`/`visible`/`opacity:1`, confirmed via `getBoundingClientRect` and `document.body.textContent`). This was a test-script artifact, not a product defect; re-verified directly against `textContent` and confirmed correct.*

### 3. User-typed text is never translated

- ☑ Typed a marker containing mixed Latin+Thai (`MY_CUSTOM_TEXT_12345_ห้ามแปล`) into a workspace field — value unchanged after toggling EN→TH→EN, and unchanged verbatim in the live preview while surrounding labels switched
- ☑ Typed a marker into the editor's left pane (`CUSTOM_EDITOR_TEXT_ห้ามแปล_98765`) — `textarea` value byte-identical after toggling to TH

### 4. Topic/format switch after toggling to TH

- ☑ With TH active, filled the SWE topic's goal field, switched to "Research & Brainstorm" — field is separate/blank; switched back to Software Engineering — typed value (`SWE_TOPIC_MARKER`) still present
- ☑ Switched format Prompt → SKILL.md — typed content preserved in the preview; structure changed to Thai SKILL.md headings ("ใช้เมื่อไร" / "ข้อมูลที่ต้องมี")

### 5. Reload persistence

- ☑ `localStorage.getItem('esmd.lang')` = `"th"` after selecting TH
- ☑ After `page.reload()`: `<html lang="th">` set pre-paint (no flash — verified via `LangScript`'s inline no-flash script, and no hydration warning observed)
- ☑ TH segment `aria-pressed="true"` after reload
- ☑ Zero console errors and zero console warnings after reload (rules out a `useSyncExternalStore` hydration-mismatch warning, which was a specific risk given `getServerSnapshot()` always returns `'en'` while the client can settle on `'th'` — confirmed React's post-mount re-render path here produces no warning)

### 6. Blocked localStorage

- ☑ Custom browser context with a `localStorage`/`sessionStorage` getter that throws (matching the prior pass's method) — all 4 routes (`/`, `/markdown`, `/editor`, `/agentic`) load, default to `<html lang="en">`, and render `.shell-main` visibly
- ☑ Toggle still works in-session with storage blocked (`<html lang>` flips to `th` on click)
- ☑ Zero console errors across all 4 routes with storage blocked

### 7. Thai font rendering

- ☑ Computed `font-family` on the Thai hero heading: `Sora, "Sora Fallback", "Noto Sans Thai", "Noto Sans Thai Fallback", system-ui, sans-serif` — a Thai-capable stack with explicit fallback fonts, not just the Latin `Sora`
- ☑ Visual screenshot confirms correct glyph shaping (tone marks, stacked vowels) with no tofu/missing-glyph boxes across hero heading, eyebrow, body copy, CTA, and nav

### 8. Editor sample doc language

- ☑ Selected TH on `/`, then loaded `/editor` fresh — pristine `textarea` value starts with `## บันทึกประชุม Weekly Sync` (the Thai sample doc from `th.ts`), confirming the Thai version seeds on first load when TH is already selected
- ☑ Typed one additional character at the end of the pristine doc, then toggled language — `textarea` value identical before/after the toggle (existing document text is never mutated by a language switch)

### 9. History / saved agents survive language toggle

- ☑ Workspace: saved an entry with goal `"History Save Test EN Goal"` in EN, toggled to TH — sidebar list label switches to "ประวัติ", saved entry's title text is unchanged (frozen at save time, not re-translated)
- ☑ Cleared the goal field, clicked the saved history entry — form re-renders in Thai with the original typed value restored (`"History Save Test EN Goal"`)
- ☑ Agentic: saved an agent named `FinalCheckAgent` in EN, toggled to TH — sidebar heading `.ag-side-title` switches to "Agent ของคุณ" (confirmed via `textContent`), saved agent's name in the sidebar list is unchanged

### 10. Regression spot-check (existing EN behavior, not re-run in full)

- ☑ Theme toggle still switches `data-theme` (`light` ↔ `dark`) after the language-toggle feature landed
- ☑ Editor still live-renders Markdown (`# Header` → `<h1>`, `**bold**` → `<strong>`) after a language-adjacent edit
- ☑ No console errors introduced during the regression spot-check

### Result: 61/61 browser checks passed · 0 real failures

3 assertions in the first automated pass initially reported FAIL (agentic group titles, editor pristine-doc content, agent sidebar title-casing) — all 3 were traced to bugs in the QA driver script itself (viewport-height-limited `innerText()`, an inverted string-exclusion check, and an exact-case string match against CSS-transformed rendered text) and were re-verified directly against `textContent`/`inputValue()`/`getBoundingClientRect`, confirming the application behavior was correct in every case. No source files were touched to reach this result — the fix was to the test assertions only.

### Known gaps / non-issues (do not file as bugs)

- The home page's static code-demo panel (`agent-instruction.md` illustration, right side of hero) stays in English text when TH is selected — this is decorative sample content embedded in the marketing demo, not app-authored UI chrome, labels, or generated Markdown output covered by spec §5's scope
- "Guardrails" group label is identical in both `en.ts` and `th.ts` by design (kept as an English technical term per the project's stated Thai copy convention — see `th.ts` header comment)
