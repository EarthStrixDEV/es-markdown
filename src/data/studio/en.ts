import type { StudioStrings } from './types';

/*
 * English Studio strings. The text guardrail/follow-ups mirror the Workspace
 * set in i18n/en.ts.
 *
 * AUTHORED — PENDING P'EARTH CONTENT REVIEW: the media guardrail/follow-up
 * set and every per-type extra-field default below (e.g. Image aspect ratio
 * "1:1", Music "Instrumental") were authored by Min-Ju, not supplied.
 */
export const studioEn: StudioStrings = {
  locale: 'en',

  common: {
    task: {
      label: 'Task',
      placeholder:
        'What should the AI produce? e.g. "Write a migration that adds a status column to orders"',
      def: 'Complete the request described in the context below and return one finished result, not a plan for one.',
    },
    context: {
      label: 'Context',
      placeholder: 'Background, current state, why this matters',
      def: 'No extra background is provided. Work only from what is stated here and list any assumption you have to make.',
    },
    audience: {
      label: 'Audience / Role',
      placeholder: 'e.g. Senior backend engineer reviewing a PR',
      def: 'A capable non-specialist who wants a clear, usable result without jargon.',
    },
    constraints: {
      label: 'Constraints',
      placeholder: 'One per line, e.g. "No new dependencies"',
      def: "Stay within the scope of the task — don't add unrequested features\nPrefer the simplest approach that fully works\nFlag anything you could not verify",
    },
    output: {
      label: 'Output',
      placeholder: 'Format, structure, length of the result',
      def: 'A single, complete deliverable, followed by a 2–3 line note on key decisions and anything left open.',
    },
    tone: {
      label: 'Tone / Style',
      placeholder: 'e.g. Direct and technical',
      def: 'Clear, direct, and concrete — no filler or hype.',
    },
    examples: {
      label: 'Examples / References',
      placeholder: 'Samples, links, or a reference to match',
      def: 'No examples provided. Follow common best practice for this kind of work and say which convention you chose.',
    },
  },

  types: {
    code: {
      label: 'Code',
      description: 'Write, fix, or refactor code in an existing codebase',
      fields: {
        language: {
          label: 'Language / Stack',
          placeholder: 'e.g. TypeScript, Next.js 15, React 19',
          def: 'Infer the language from the existing code; if there is none, use TypeScript and say so.',
        },
        existingCode: {
          label: 'Existing code',
          placeholder: 'Paste the relevant code or file paths',
          def: 'No existing code provided. Write self-contained code and state where it would live in a typical project.',
        },
      },
    },
    'new-project': {
      label: 'New Project',
      description: 'Scaffold a new app or service from scratch',
      fields: {
        stack: {
          label: 'Stack',
          placeholder: 'e.g. Next.js + Postgres + Prisma',
          def: 'Recommend one mainstream, well-documented stack for this project and justify it in 2–3 lines.',
        },
        scope: {
          label: 'Scope / MVP features',
          placeholder: 'One feature per line',
          def: 'Only the smallest feature set that makes the core use case work end to end\nNo auth, payments, or admin panels unless listed',
        },
        platform: {
          label: 'Target platform',
          placeholder: 'e.g. Web (desktop + mobile browsers)',
          def: 'Web, responsive for desktop and mobile browsers.',
        },
      },
    },
    image: {
      label: 'Image',
      description: 'Prompt an image generator',
      fields: {
        aspectRatio: {
          label: 'Aspect ratio',
          placeholder: 'e.g. 16:9',
          def: '1:1',
        },
        imageStyle: {
          label: 'Style preset',
          placeholder: 'Pick one or more',
          def: 'Photorealistic',
          optionLabels: {
            photorealistic: 'Photorealistic',
            cartoon: 'Cartoon',
            '3d': '3D',
            sketch: 'Sketch',
            clay: 'Clay',
          },
          otherLabel: 'Other',
        },
        imageStyleOther: {
          label: 'Other style',
          placeholder: 'e.g. Watercolor',
          def: 'None',
        },
        visualStyle: {
          label: 'Visual style',
          placeholder: 'e.g. Soft watercolor, muted palette',
          def: 'Photorealistic, natural lighting, sharp focus on the subject.',
        },
        subject: {
          label: 'Subject',
          placeholder: 'Who or what is in the frame, doing what, where',
          def: 'Take the subject from the task; keep it centered and fully in frame.',
        },
        negativePrompt: {
          label: 'Negative prompt',
          placeholder: 'What must not appear',
          def: 'text, watermark, logo, extra limbs, distorted hands, blurry, low resolution',
        },
      },
    },
    video: {
      label: 'Video',
      description: 'Prompt a video generator',
      fields: {
        duration: {
          label: 'Duration',
          placeholder: 'e.g. 8 seconds',
          def: '8 seconds, one continuous shot.',
        },
        shot: {
          label: 'Shot / Camera',
          placeholder: 'e.g. Slow dolly-in, eye level, 35mm',
          def: 'Medium shot at eye level, slow steady push-in, no cuts.',
        },
        videoStyle: {
          label: 'Style preset',
          placeholder: 'Pick one or more',
          def: 'Cinematic',
          optionLabels: {
            cinematic: 'Cinematic',
            anime: 'Anime',
            '3d-animation': '3D Animation',
            'stop-motion': 'Stop-motion',
            documentary: 'Documentary',
          },
          otherLabel: 'Other',
        },
        videoStyleOther: {
          label: 'Other style',
          placeholder: 'e.g. Watercolor',
          def: 'None',
        },
        visualStyle: {
          label: 'Style',
          placeholder: 'e.g. Cinematic, teal-orange grade',
          def: 'Cinematic realism, natural color grade, soft daylight.',
        },
        aspectRatio: {
          label: 'Aspect ratio',
          placeholder: 'e.g. 9:16',
          def: '16:9',
        },
      },
    },
    audio: {
      label: 'Audio / Voice',
      description: 'Voice-over, narration, or text-to-speech',
      fields: {
        voice: {
          label: 'Voice character',
          placeholder: 'e.g. Warm female narrator, 30s, neutral accent',
          def: 'Warm, neutral-accent adult narrator.',
        },
        script: {
          label: 'Script',
          placeholder: 'The exact words to speak',
          def: 'No script provided. Write a short script from the task (under 60 seconds read aloud) and read it as written.',
        },
        pace: {
          label: 'Pace / Emotion',
          placeholder: 'e.g. Calm, slightly upbeat, 150 wpm',
          def: 'Moderate pace (~150 words per minute), calm and friendly, brief pauses between sentences.',
        },
      },
    },
    music: {
      label: 'Music',
      description: 'Prompt a music generator',
      fields: {
        genre: {
          label: 'Genre',
          placeholder: 'e.g. Lo-fi hip hop',
          def: 'Modern acoustic pop.',
        },
        mood: {
          label: 'Mood',
          placeholder: 'e.g. Nostalgic, hopeful',
          def: 'Warm and uplifting.',
        },
        bpm: {
          label: 'BPM',
          placeholder: 'e.g. 90',
          def: '100',
        },
        vocals: {
          label: 'Vocals / Instrumental',
          placeholder: 'e.g. Male vocals, or Instrumental',
          def: 'Instrumental',
        },
        lyrics: {
          label: 'Lyrics',
          placeholder: 'Lyrics, if the track has vocals',
          def: 'None — instrumental track.',
        },
      },
    },
    'agent-task': {
      label: 'Agent Task',
      description: 'Delegate a multi-step task to an autonomous agent',
      fields: {
        tools: {
          label: 'Tools allowed',
          placeholder: 'One tool per line',
          def: 'Read files in the working directory\nRun read-only shell commands\nNo network access, no deleting files',
        },
        stopConditions: {
          label: 'Stop conditions',
          placeholder: 'When the agent must stop, one per line',
          def: 'The task is done and verified\nThe same step has failed twice\nThe next step would go outside the stated scope',
        },
        approvalPoints: {
          label: 'Approval points',
          placeholder: 'Actions that need a human OK first, one per line',
          def: 'Before deleting or overwriting anything\nBefore any action visible outside this workspace (push, deploy, send)\nBefore installing new dependencies',
        },
      },
    },
    research: {
      label: 'Research',
      description: 'Investigate a question and report findings',
      fields: {
        question: {
          label: 'Question',
          placeholder: 'The exact question to answer',
          def: 'Answer the task as a single research question and restate it in one sentence before starting.',
        },
        sources: {
          label: 'Sources to trust',
          placeholder: 'One source type or site per line',
          def: 'Official documentation and primary sources first\nPeer-reviewed or well-cited publications\nCite every claim with a link; mark anything unsourced',
        },
        depth: {
          label: 'Depth',
          placeholder: 'e.g. Quick scan, or Deep dive',
          def: 'Focused overview: key findings, the main disagreement if any, and a one-paragraph recommendation.',
        },
      },
    },
    content: {
      label: 'Content',
      description: 'Posts, articles, emails, and copy',
      fields: {
        platform: {
          label: 'Platform',
          placeholder: 'e.g. LinkedIn, blog, email newsletter',
          def: 'A general blog post readable on web and mobile.',
        },
        length: {
          label: 'Length',
          placeholder: 'e.g. 150 words',
          def: '300–500 words.',
        },
        cta: {
          label: 'Call to action',
          placeholder: 'What the reader should do next',
          def: 'End with one clear, low-pressure next step for the reader.',
        },
      },
    },
    ideation: {
      label: 'Ideation',
      description: 'Brainstorm options and ideas',
      fields: {
        count: {
          label: 'Number of ideas',
          placeholder: 'e.g. 10',
          def: '10',
        },
        novelty: {
          label: 'Constraints on novelty',
          placeholder: 'How safe or wild the ideas should be',
          def: 'Mix: about half practical and doable now, half unconventional. No near-duplicates — each idea must differ in approach, not just wording.',
        },
      },
    },
    other: {
      label: 'Other',
      description: 'Anything else — common fields only',
      fields: {},
    },
  },

  guardrails: {
    text: {
      guardrail: {
        heading: 'If information is missing',
        body: "If the information above isn't enough to do this job well, first ask up to 3 of the most important questions and wait for the answers. Don't guess and keep going. For anything without supporting information, say plainly that you don't know — never make it up.",
      },
      followUps: {
        heading: 'Follow-up messages',
        items: [
          'The draft is too broad. Keep only the parts that serve the main goal, cut the rest, and list what you removed so I can confirm nothing important was lost.',
          "You assumed something that isn't true: [name it here]. Correct it, redo only the parts that assumption touched, and flag anything else that depended on it.",
          'Give me two alternative versions of the weakest section — one safer, one bolder — with one line each on what that version trades away.',
        ],
      },
    },
    /* AUTHORED — pending P'Earth content review. */
    media: {
      guardrail: {
        heading: 'Generation rules',
        body: "Don't add text, captions, logos, or watermarks unless they are asked for above. Keep the subject consistent — same identity, colors, and key details — across every output and revision. If a requirement conflicts with another, follow the Task and say which one you dropped.",
      },
      followUps: {
        heading: 'Follow-up messages',
        items: [
          'Keep everything else the same, but make it more [quality — e.g. dramatic, minimal, warm]. Change only what that needs.',
          'Keep the same subject and style, but change the composition: [e.g. wider framing, subject off-center, lower angle].',
          'Give me a variation: same subject and brief, a clearly different take on [one element — e.g. lighting, palette, arrangement].',
        ],
      },
    },
  },

  ui: {
    typeListTitle: 'Prompt type',
    typeSwitchLocked: 'Regenerate from form to switch type',
    historyEmpty: 'Nothing saved yet — build a prompt and hit Save.',
    deleteEntryLabel: 'Delete "{title}" from history',
    confirmDelete: 'Delete "{title}" from history?',
    confirmRegenerate:
      'Regenerate all outputs from the form? Your edits to the output will be overwritten.',
    lockedBanner: "You've edited the output — the form is locked.",
    regenerate: 'Regenerate from form',
    formLabel: '{type} prompt form',
    commonGroup: 'Common',
    typeGroup: '{type} details',
    formatTabsLabel: 'Output format',
    formats: { plain: 'Plain', json: 'JSON', markdown: 'Markdown' },
    outputLabel: '{format} output',
    stale: 'Not in sync with your edits',
    staleSr: '(not in sync with your edits)',
    jsonErrorPrefix: 'Invalid JSON:',
    charCount: '{count} chars',
  },
};
