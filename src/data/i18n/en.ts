import type { Strings } from './types';

/*
 * English strings — all app-authored content lives here.
 * DEF defaults follow the mockup's tone: concrete, 1–2 sentences, written to
 * keep the output specific even when the user types nothing.
 */
export const en: Strings = {
  locale: 'en',

  ui: {
    chooseTopic: 'Choose a topic',
    history: 'History',
    historyEmpty: 'Nothing saved yet — fill a form and hit Save.',
    reset: 'Reset',
    saveToHistory: 'Save to history',
    savedFlash: 'Saved ✓',
    pageSubtitle:
      'Answer what you know — ES Markdown fills the rest with defaults built to keep the brief specific.',
    ifEmpty: 'If empty:',
    formatted: 'Formatted',
    plainText: 'Plain text',
    copy: 'Copy',
    chars: 'chars',
    written: 'written',
    followUpNote:
      'Follow-up pack ready: 3 pre-written next messages for when the first draft is close but not quite there — they sit below the divider in the Prompt output, never sent with the main prompt.',
    agentLinkLabel: 'Create Agent',
    agentLinkTagline: '11 fields → AGENT.md, in the Agentic module',
  },

  formats: {
    prompt: { label: 'Prompt .md' },
    skill: { label: 'SKILL.md' },
    workflow: { label: 'Workflow .md' },
  },

  sections: {
    prompt: {
      goal: 'Goal',
      context: 'Context',
      startingData: 'Starting data',
      requirements: 'Requirements',
      constraints: 'Constraints',
      outputFormat: 'Output format',
      qualityBar: 'Quality bar',
    },
    skill: {
      whenToUse: 'When to use',
      requiredInfo: 'Required info',
      steps: 'Steps',
      constraints: 'Constraints',
      outputFormat: 'Output format',
      qualityBar: 'Quality bar',
    },
    workflow: {
      objective: 'Objective',
      context: 'Context',
      inputs: 'Inputs',
      taskSequence: 'Task sequence',
      constraints: 'Constraints',
      deliverables: 'Deliverables',
      doneWhen: 'Done when',
    },
  },

  prefixes: { audience: 'Audience', avoid: 'Avoid' },

  guardrail: {
    heading: 'If information is missing',
    body: "If the information above isn't enough to do this job well, first ask up to 3 of the most important questions and wait for the answers. Don't guess and keep going. For anything without supporting information, say plainly that you don't know — never make it up.",
  },

  followUpPack: {
    warning:
      'Follow-up pack — keep below the divider. These are pre-written next messages for after the first reply; never send them together with the main prompt.',
    items: [
      'The draft is too broad. Keep only the parts that serve the main goal, cut the rest, and list what you removed so I can confirm nothing important was lost.',
      "You assumed something that isn't true: [name it here]. Correct it, redo only the parts that assumption touched, and flag anything else that depended on it.",
      'Give me two alternative versions of the weakest section — one safer, one bolder — with one line each on what that version trades away.',
    ],
  },

  workflow: {
    stepConfirm: 'Confirm the result of this step before starting the next one.',
  },

  topics: {
    swe: {
      label: 'Software Engineering',
      tagline: 'Build & fix briefs that respect the existing code',
      docTitle: 'Software Engineering Brief',
      formTitle: 'Engineering brief',
      formNote: '9 fields · maps to Goal, Context, Requirements & Constraints',
      fields: {
        goal: {
          label: 'What should be built or fixed?',
          placeholder: 'e.g. add CSV export to the reports page',
          def: 'Deliver the smallest change that solves the stated problem end to end, working and tested.',
        },
        context: {
          label: 'Project context',
          placeholder: 'stack, framework versions, how the app is structured',
          def: 'Read the existing codebase first and infer the stack, structure, and conventions from what is actually there.',
        },
        audience: {
          label: 'Who works with this code',
          placeholder: 'e.g. a small team of mid-level TypeScript devs',
          def: 'The existing maintainers — follow the conventions already visible in the code, not personal preference.',
        },
        startingData: {
          label: 'Starting point',
          placeholder: 'relevant files, error messages, current behavior',
          def: 'No files are pre-identified — locate the relevant code by searching the repository before changing anything.',
        },
        requirements: {
          label: 'Must-haves',
          placeholder: 'one per line: behaviors, endpoints, edge cases',
          def: 'Keep current behavior everywhere except the requested change, and cover the obvious edge cases (empty, invalid, concurrent).',
        },
        constraints: {
          label: 'Constraints',
          placeholder: 'e.g. no new dependencies, keep the public API stable',
          def: 'No new dependencies, no breaking changes to public interfaces, no drive-by refactors outside the task.',
        },
        avoid: {
          label: 'One thing to avoid',
          placeholder: 'e.g. rewriting modules that already work',
          def: "Rewriting working code the task doesn't touch.",
        },
        outputFormat: {
          label: 'Output format',
          placeholder: 'e.g. a diff, a PR description, file-by-file changes',
          def: 'Changed files with complete code — no snippets with parts elided — plus a short note on what changed and why.',
        },
        qualityBar: {
          label: 'Good enough when',
          placeholder: 'e.g. tests pass, lint clean, edge cases reviewed',
          def: "The code compiles, existing and new tests pass, and the change follows the project's own conventions.",
        },
      },
    },

    research: {
      label: 'Research & Brainstorm',
      tagline: 'Questions, sources, and honest unknowns',
      docTitle: 'Research Brief',
      formTitle: 'Research brief',
      formNote: '9 fields · maps to Goal, Context, Requirements & Constraints',
      fields: {
        goal: {
          label: 'What do you want to find out?',
          placeholder: 'e.g. whether we should switch to usage-based pricing',
          def: 'Produce a clear answer to the stated question, with the reasoning laid out so it can be checked.',
        },
        context: {
          label: 'Background',
          placeholder: 'what prompted this, what you already believe',
          def: 'Assume no prior discussion — state the working assumptions you adopt before answering.',
        },
        audience: {
          label: 'Who will read this',
          placeholder: "e.g. the founding team deciding next quarter's bet",
          def: 'A busy decision-maker who reads the summary first and the details only if needed.',
        },
        startingData: {
          label: 'What you already have',
          placeholder: 'links, notes, data points, past research',
          def: 'No sources are provided — gather evidence yourself and cite where each claim comes from.',
        },
        requirements: {
          label: 'Must cover',
          placeholder: 'one per line: questions, options, comparisons',
          def: 'The main question, the strongest case against the emerging answer, and at least two alternatives.',
        },
        constraints: {
          label: 'Constraints',
          placeholder: 'e.g. only 2024+ sources, exclude vendor blogs',
          def: "Prefer primary sources, mark uncited claims as opinion, and write 'unknown' where the evidence is missing.",
        },
        avoid: {
          label: 'One thing to avoid',
          placeholder: 'e.g. cherry-picking sources that agree with us',
          def: 'Presenting a guess with the confidence of a fact.',
        },
        outputFormat: {
          label: 'Output format',
          placeholder: 'e.g. one-page summary + source list',
          def: 'A short summary up top, findings grouped by question, and a source list at the end.',
        },
        qualityBar: {
          label: 'Good enough when',
          placeholder: 'e.g. each claim traceable to a source',
          def: 'Every key claim is traceable to a source or explicitly flagged as unverified.',
        },
      },
    },

    content: {
      label: 'Content & Script',
      tagline: 'Platform-aware scripts and copy briefs',
      docTitle: 'Content Brief',
      formTitle: 'Content brief',
      formNote: '9 fields · maps to Goal, Context, Requirements & Constraints',
      fields: {
        goal: {
          label: 'What needs to be written?',
          placeholder: 'e.g. a 60-second product launch script',
          def: 'One finished piece, ready to publish after a single human pass.',
        },
        context: {
          label: 'Background',
          placeholder: 'the product, campaign, or story behind it',
          def: "Work only from the information given here — don't invent product claims or history.",
        },
        audience: {
          label: 'Audience',
          placeholder: 'e.g. first-time visitors from a paid ad',
          def: 'General visitors, no assumed familiarity with the brand.',
        },
        startingData: {
          label: 'Raw material',
          placeholder: 'notes, quotes, features, links to reuse',
          def: 'No raw material is provided — build from the goal and clearly separate suggestion from fact.',
        },
        requirements: {
          label: 'Must include',
          placeholder: 'one per line: key messages, sections, CTA',
          def: 'One clear main message, a concrete call to action, and a hook inside the first two lines.',
        },
        constraints: {
          label: 'Constraints',
          placeholder: 'e.g. under 200 words, no jargon',
          def: "Match the target platform's norms and length limits, and keep one consistent voice from start to finish.",
        },
        avoid: {
          label: 'One thing to avoid',
          placeholder: "e.g. buzzwords like 'revolutionary'",
          def: 'Generic filler that could describe any product.',
        },
        outputFormat: {
          label: 'Output format',
          placeholder: 'e.g. headline + body + CTA, or a two-column script',
          def: 'Ready-to-paste text in the structure named in the goal, with no meta commentary.',
        },
        qualityBar: {
          label: 'Good enough when',
          placeholder: 'e.g. reads aloud naturally in one take',
          def: 'It reads naturally aloud and nothing in it needs a fact-check before publishing.',
        },
      },
    },

    everyday: {
      label: 'Everyday tasks',
      tagline: 'Plain-language help for ordinary tasks',
      docTitle: 'Task Brief',
      formTitle: 'Task brief',
      formNote: '9 fields · maps to Goal, Context, Requirements & Constraints',
      fields: {
        goal: {
          label: 'What do you need done?',
          placeholder: 'e.g. plan a 3-day Chiang Mai trip on a budget',
          def: 'Get the task done in the simplest way that actually works.',
        },
        context: {
          label: 'Situation',
          placeholder: 'anything about your situation that changes the answer',
          def: 'Assume an ordinary situation, and say which assumptions were made.',
        },
        audience: {
          label: 'Who is this for',
          placeholder: 'e.g. me and my parents, ages 60+',
          def: 'Just for you — plain language, no specialist knowledge needed.',
        },
        startingData: {
          label: "What you're starting with",
          placeholder: 'dates, budget, lists, whatever you have',
          def: 'Nothing is provided — start from scratch and list what extra information would improve the answer.',
        },
        requirements: {
          label: 'Must have',
          placeholder: 'one per line: the non-negotiables',
          def: "Cover the essentials a careful person wouldn't skip for this kind of task.",
        },
        constraints: {
          label: 'Limits',
          placeholder: 'e.g. budget, time, dietary limits',
          def: 'Keep it low-cost and low-effort unless the request says otherwise.',
        },
        avoid: {
          label: 'One thing to avoid',
          placeholder: 'e.g. options that need booking months ahead',
          def: 'Overcomplicating a simple task.',
        },
        outputFormat: {
          label: 'How you want the answer',
          placeholder: 'e.g. a checklist, a day-by-day plan',
          def: "A short, step-by-step list that's easy to follow on a phone.",
        },
        qualityBar: {
          label: 'Good enough when',
          placeholder: 'e.g. I could start on it today',
          def: 'You could act on it today without needing to ask anything back.',
        },
      },
    },
  },

  agent: {
    pageSubtitle:
      'Fill what you know about how this agent should behave — unfilled fields default to the safest option, not a blank.',
    formViewLabel: 'Form design',
    newAgent: 'New agent',
    yourAgents: 'Your agents',
    saveAgent: 'Save agent',
    savedFlash: 'Saved ✓',
    defaultTitle: 'New Agent',
    defaultSubtitle: 'Untitled · draft',
    toolsFrontmatterDefault: 'read-only',
    safetyStrong: 'Default posture is intentionally strict.',
    safetyBody:
      'Leaving Tools or Rule blank gives this agent read-only access and no ability to act without sign-off — safer than guessing wrong on an agent that can take irreversible actions.',

    groups: {
      identity: 'Identity',
      behavior: 'Behavior',
      guardrails: 'Guardrails',
    },

    /* AGENT.md body headings, spec §6 order (sequence lives in agent-fields.ts). */
    sections: {
      role: 'Role',
      instruction: 'Instruction',
      usedWhen: 'Used when',
      input: 'Input',
      tools: 'Tools',
      steps: 'Steps',
      rule: 'Boundaries & escalation',
      voice: 'Voice',
      outputHandoff: 'Output & handoff',
      successCriteria: 'Success criteria',
    },

    fields: {
      name: {
        label: 'Name',
        placeholder: 'e.g. Support Triage Agent',
        def: 'New Agent',
      },
      role: {
        label: 'Role',
        placeholder: 'what it does, in one or two sentences',
        def: 'A narrow, single-purpose assistant that prepares work for a human to review — it supports their judgment, it does not replace it.',
      },
      instruction: {
        label: 'Instruction',
        placeholder: 'the core order it follows — one step per line',
        def: 'Do only the task described in this file. If a request falls outside it, say so and stop — never improvise a wider job.',
      },
      voice: {
        label: 'Personality & voice',
        placeholder: 'e.g. calm, precise, no corporate filler',
        def: 'neutral and concise, no exclamation points',
      },
      usedWhen: {
        label: 'Used when / triggered by',
        placeholder: 'e.g. a new ticket lands in #support-inbox',
        def: 'Only when a human explicitly invokes it — never triggered automatically.',
      },
      input: {
        label: 'Input it receives at start',
        placeholder: "e.g. ticket text + customer's prior thread",
        def: 'Only what the human hands over at start — assume no access to anything not explicitly provided.',
      },
      tools: {
        label: 'Tools it can use',
        placeholder: 'e.g. Zendesk read, internal wiki search',
        def: 'read & search only — no send, no delete, no irreversible action',
      },
      steps: {
        label: 'Steps it follows',
        placeholder: 'one step per line',
        def: '1. Restate the task and list any missing information.\n2. Do the work with permitted tools only, noting which were used.\n3. Hand the result to a human for review — take no further action.',
      },
      rule: {
        label: 'Rule — hard limits & escalation',
        placeholder: 'e.g. never close a ticket without human sign-off',
        def: 'Escalate to a human before anything irreversible — sending, deleting, publishing, or spending. If unsure whether an action is reversible, treat it as irreversible and ask first.',
      },
      outputHandoff: {
        label: 'Output & handoff — how results reach a person',
        placeholder: 'e.g. drafted reply posted as internal note',
        def: 'Posted as a draft and flagged for human review — nothing goes out automatically.',
      },
      successCriteria: {
        label: 'Considered successful when',
        placeholder: 'e.g. every ticket tagged within 2 minutes',
        def: 'A human accepts the result without rework, and every action taken is traceable and reversible.',
      },
    },

    graph: {
      heading: 'Workflow graph',
      optionalBadge: 'Optional view',
      previewOnlyBadge: 'Preview only — not saved, not linked to this form',
      paletteChips: ['+ Role', '+ Step', '+ Decision', '+ Tool', '+ Output'],
      canvasHint: 'Static preview — nodes and connections are illustrative only.',
      nodes: [
        { kind: 'Role', text: 'Support triage, first-line only' },
        { kind: 'Step', text: 'Tag severity P1–P3' },
        { kind: 'Decision', text: 'Legal or refund > ฿5,000?' },
        { kind: 'Step', text: 'Draft first reply' },
        { kind: 'Output', text: 'Post as draft, flag for review' },
      ],
    },
  },
};
