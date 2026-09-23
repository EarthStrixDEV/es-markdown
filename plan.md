# Plan — Studio module

## Goal
Add a fifth module, **Studio** (`/studio`). The user fills a form for any kind of prompt, and Studio produces the prompt in **Plain Text, JSON, and Markdown**. The user can then edit the generated prompt freely.

## Scope

**In**
- Route `/studio`, plus a "Studio" nav item after Agentic in `AppShell`. Home is not touched.
- 11 prompt types: Code · New Project · Image · Video · Audio/Voice · Music · Agent Task · Research · Content · Ideation · Other.
- 7 common fields: Task (required), Context, Audience/Role, Constraints, Output, Tone/Style, Examples/References.
- Per-type fields as agreed in the grilling session (Q16). Other has no extra fields.
- Every field has an "If empty:" default, so every section is always present.
- Three output formats:
  - **Plain**: `TASK:`-style uppercase labels, blank line between sections, `- ` lists.
  - **JSON**: keyed by field, `{ type, task, context, audience, constraints[], output, tone, examples, params:{…} }`.
  - **Markdown**: same style as Workspace output.
- Guardrail and 3-message follow-up pack on every type:
  - text set for the text types.
  - new **media set** for Image/Video/Audio/Music. Min-Ju authors it, so it is pending P'Earth's content review.
- Free edit:
  - After the first manual edit, the form **locks**.
  - **Regenerate** rebuilds from the form. It overwrites edits after a confirm warning.
  - Edits apply to one format at a time. The other two keep the form version and show a **"not in sync with your edits"** badge.
- Editors:
  - Markdown reuses the Editor module's toolbar and grouped undo/redo.
  - Plain and JSON use a plain textarea. JSON also shows an inline parse-error warning.
- History:
  - Saved to `localStorage` with an explicit **Save** button.
  - Max 50 entries; the oldest is dropped past the cap.
  - Entries can be deleted one at a time.
  - All reads and writes go through the existing safe-storage wrapper.
- EN strings only, added through the existing i18n layer so a future `th.ts` stays refactor-free.
- Styling uses existing tokens only. No new hex outside `tokens.css`.
- Unit tests (Vitest).

**Out**
- Changes to Workspace, Agentic, or Home.
- Thai content.
- Auto-converting an edited format into the other formats.
- Running prompts against a real AI.
- Cross-device sync.

## Steps (dependency order)

1. **Data model**
   - `src/data/studio/` holds the type registry (11 types, icon, label, extra field defs) and the common field defs with EN labels, placeholders, and defaults.
   - Guardrail and follow-up sets: text + media.
   - Types: `StudioType`, `StudioFieldDef`, `StudioValues`.
2. **Assembler**
   - `src/lib/studio-assembler.ts` is a set of pure functions: `toPlain(values, type)`, `toJson(values, type)`, `toMarkdown(values, type)`.
   - Each field resolves as input → default.
   - Constraints and list fields split on newlines.
   - Guardrail and follow-up are placed per format:
     - JSON: `guardrail` / `follow_ups` keys.
     - Plain and Markdown: trailing sections.
   - Style follows `src/lib/assembler.ts`.
3. **Assembler tests**
   - Each format × a text type and a media type.
   - An empty form still yields every section.
   - Per-type params appear only for that type, and Other has none.
   - JSON output always round-trips through `JSON.parse`.
   - Media types get the media guardrail set.
4. **State reducer**
   - `src/modules/studio/studio-state.ts` holds: selected type, field values, per-format `{ text, edited }`, and `locked`.
   - Actions: selectType, setField, editOutput(format), regenerate, loadHistory, reset.
   - Tests cover:
     - lock on first edit
     - regenerate clears edits and unlocks
     - stale flags on the non-edited formats
     - setField ignored while locked
5. **History store**
   - `src/lib/studio-history.ts` handles load, save, delete, and the 50-cap using the safe-storage wrapper.
   - Tests cover: the cap drops the oldest, delete by id, corrupt JSON in storage falls back to empty.
6. **Editor reuse**
   - Extract the toolbar and grouped-undo hook from `src/modules/editor/` into a shared component or hook if they aren't already shareable.
   - The Editor module keeps identical behavior, and its existing tests must stay green.
7. **UI**
   - `src/modules/studio/` + `src/app/studio/page.tsx` — three columns, mirroring the Workspace layout:
     - **Left sidebar**: type list and history, with Save and per-entry delete.
     - **Middle**: the form, using the shared `Field` component, with a locked banner and a Regenerate button.
     - **Right**: output tabs (Plain / JSON / Markdown) holding the editable pane, the stale badge, Copy, and a JSON error line.
   - Styles in `studio.css` use tokens only.
8. **Nav**: add Studio to `AppShell`.
9. **Verify**
   - `npm run lint`, `npm run test`, `npm run build` (static export).
   - Browser pass: each type renders, the lock/regenerate flow, per-format edits with the stale badge, history persisting across a reload, and light/dark themes.

## Open questions / risks
- **Editor extraction (step 6)** may touch Editor internals. Risk of regressions in the Editor module, so its tests and a manual check are required.
- **Media guardrail and follow-up copy** is authored and must be flagged for P'Earth's review, same as the pending DEF content.
- **Per-type defaults** (e.g. Image aspect ratio "1:1", Music "instrumental") are authored defaults that also need review.
- **The Workspace "Home input lost" and SKILL.md frontmatter bugs** are known and out of scope here. Studio must not copy the SKILL.md frontmatter rendering bug if it renders frontmatter.
