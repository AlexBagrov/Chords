type CapoBadgeProps = {
  fret: number
  className?: string
}

/** Значок каподастра (trigger/Kyser-style) + номер лада. */
export default function CapoBadge({ fret, className }: CapoBadgeProps) {
  return (
    <span
      className={className ? `capo-badge ${className}` : 'capo-badge'}
      title={`Каподастр на ${fret} ладу`}
      aria-label={`Каподастр на ${fret} ладу`}
    >
      <svg
        className="capo-badge-icon"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* планка на струны */}
        <path d="M7.5 5.8h13.2" />
        {/* шарнир */}
        <circle cx="6.4" cy="5.8" r="1.7" />
        {/* нижняя губка / рычаг к планке */}
        <path d="M8.2 7.6c1.8 0.9 3.6 1.2 5.6 0.55" />
        {/* задняя рукоять */}
        <path d="M6.4 7.5c-0.35 2.8-1.1 6.2-1.55 9.1-0.2 1.15 0.45 2.2 1.65 2.55" />
        {/* триггер */}
        <path d="M13.6 8.4c1.55 0.55 2.85 1.85 3.15 3.55 0.35 1.85-0.35 3.55-1.85 4.55" />
        {/* пружина */}
        <path d="M8.1 10.4l1.15 1-1.15 1 1.15 1-1.15 1" strokeWidth="1.8" />
      </svg>
      <span className="capo-badge-fret">{fret}</span>
    </span>
  )
}
