/*
 * ES Markdown mark: an "M" with a down arrow (Markdown's M↓), drawn in
 * currentColor so the container decides the color. Keep in sync with
 * src/app/icon.svg (the browser-tab version, which has to hard-code colors).
 */
export function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17V7l4.75 5.5L12.5 7v10" />
      <path d="M18.5 7v9.5M15.25 13.5l3.25 3.25 3.25-3.25" />
    </svg>
  );
}
