// Inline SVG icons (lucide-style, stroke = currentColor) so they render
// reliably in the static export without an external icon font.
// Keyed by the Material-Symbol names used across the portfolio.
const PATHS: Record<string, React.ReactNode> = {
  arrow_forward: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  north_east: (
    <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </>
  ),
  psychology: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </>
  ),
  cloud_done: (
    <>
      <path d="M17.5 19a4.5 4.5 0 0 0 0-9h-1.8A7 7 0 1 0 4 15.2" />
      <polyline points="9 13 11 15 15 11" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  push_pin: (
    <>
      <path d="M12 17v5" />
      <path d="M9 10.8a2 2 0 0 1-1.1 1.79l-1.78.9A2 2 0 0 0 5 15.27V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.73a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </>
  ),
};

export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
