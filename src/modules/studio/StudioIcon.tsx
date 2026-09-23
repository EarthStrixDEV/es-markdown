import type { StudioIconId } from '@/data/studio';

const stroke = { stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' } as const;
const join = { strokeLinejoin: 'round' } as const;

function Glyph({ icon }: { icon: StudioIconId }) {
  switch (icon) {
    case 'code':
      return <path d="m5.5 5-3 3 3 3M10.5 5l3 3-3 3" {...stroke} {...join} />;
    case 'folder':
      return (
        <path
          d="M2 4.5A1.5 1.5 0 0 1 3.5 3h2.8l1.5 1.6h4.7A1.5 1.5 0 0 1 14 6.1v5.4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7Z"
          {...stroke}
          {...join}
        />
      );
    case 'image':
      return (
        <>
          <rect x="2" y="3" width="12" height="10" rx="2" {...stroke} />
          <circle cx="6" cy="6.6" r="1.2" {...stroke} />
          <path d="m2.5 11.5 3.6-3.4 2.6 2.4 2-1.8 2.8 2.6" {...stroke} {...join} />
        </>
      );
    case 'video':
      return (
        <>
          <rect x="1.8" y="4" width="9" height="8" rx="1.8" {...stroke} />
          <path d="m10.8 7 3.4-2v6l-3.4-2" {...stroke} {...join} />
        </>
      );
    case 'mic':
      return (
        <>
          <rect x="5.8" y="1.8" width="4.4" height="7.6" rx="2.2" {...stroke} />
          <path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0M8 12.2v2" {...stroke} />
        </>
      );
    case 'music':
      return (
        <>
          <path d="M6 12V3.4l7-1.4V10.6" {...stroke} {...join} />
          <circle cx="4.4" cy="12" r="1.6" {...stroke} />
          <circle cx="11.4" cy="10.6" r="1.6" {...stroke} />
        </>
      );
    case 'bot':
      return (
        <>
          <rect x="2.5" y="5" width="11" height="8" rx="2.5" {...stroke} />
          <path d="M8 5V2.2" {...stroke} />
          <circle cx="8" cy="1.8" r="1" fill="currentColor" />
          <circle cx="5.8" cy="8.7" r="1" fill="currentColor" />
          <circle cx="10.2" cy="8.7" r="1" fill="currentColor" />
        </>
      );
    case 'search':
      return (
        <>
          <circle cx="7" cy="7" r="4.4" {...stroke} />
          <path d="m10.4 10.4 3.2 3.2" {...stroke} />
        </>
      );
    case 'pen':
      return (
        <path d="m3 13 .8-3.2 7.4-7.4a1.6 1.6 0 0 1 2.3 2.3l-7.4 7.4L3 13Z" {...stroke} {...join} />
      );
    case 'bulb':
      return (
        <path
          d="M6 12.2h4M6.6 14.2h2.8M5.9 10.2a4.6 4.6 0 1 1 4.2 0c-.4.3-.6.7-.6 1.2v.8h-3v-.8c0-.5-.2-.9-.6-1.2Z"
          {...stroke}
          {...join}
        />
      );
    case 'dots':
      return (
        <>
          <circle cx="3.5" cy="8" r="1.2" fill="currentColor" />
          <circle cx="8" cy="8" r="1.2" fill="currentColor" />
          <circle cx="12.5" cy="8" r="1.2" fill="currentColor" />
        </>
      );
  }
}

export function StudioIcon({ icon }: { icon: StudioIconId }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <Glyph icon={icon} />
    </svg>
  );
}
