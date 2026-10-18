import type { ChordPosition } from '../lib/chordDiagramLookup'

type ChordDiagramProps = {
  position: ChordPosition
}

const STRING_COUNT = 6
const FRET_COUNT = 5

export default function ChordDiagram({ position }: ChordDiagramProps) {
  const { frets, fingers, baseFret, barres } = position
  const width = 140
  const height = 180
  const padX = 28
  const padY = 36
  const gridW = width - padX * 2
  const gridH = height - padY - 28
  const stringGap = gridW / (STRING_COUNT - 1)
  const fretGap = gridH / FRET_COUNT

  const stringX = (index: number) => padX + index * stringGap
  const fretY = (fret: number) => padY + fret * fretGap

  return (
    <svg
      className="chord-diagram"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-hidden="true"
    >
      {baseFret === 1 ? (
        <line
          className="chord-diagram-nut"
          x1={padX}
          y1={padY}
          x2={padX + gridW}
          y2={padY}
          strokeWidth={4}
        />
      ) : (
        <text className="chord-diagram-base" x={padX - 10} y={padY + fretGap * 0.7}>
          {baseFret}
        </text>
      )}

      {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
        <line
          key={`fret-${fret}`}
          className="chord-diagram-line"
          x1={padX}
          y1={fretY(fret)}
          x2={padX + gridW}
          y2={fretY(fret)}
        />
      ))}

      {Array.from({ length: STRING_COUNT }, (_, string) => (
        <line
          key={`string-${string}`}
          className="chord-diagram-line"
          x1={stringX(string)}
          y1={padY}
          x2={stringX(string)}
          y2={padY + gridH}
        />
      ))}

      {barres.map((barreFret) => {
        const pressed = frets
          .map((fret, string) => ({ fret, string }))
          .filter(({ fret }) => fret === barreFret)
        if (pressed.length < 2) return null
        const from = Math.min(...pressed.map((p) => p.string))
        const to = Math.max(...pressed.map((p) => p.string))
        const y = fretY(barreFret - 0.5)
        return (
          <line
            key={`barre-${barreFret}`}
            className="chord-diagram-barre"
            x1={stringX(from)}
            y1={y}
            x2={stringX(to)}
            y2={y}
            strokeWidth={10}
            strokeLinecap="round"
          />
        )
      })}

      {frets.map((fret, string) => {
        const x = stringX(string)
        if (fret === -1) {
          return (
            <text key={`mute-${string}`} className="chord-diagram-mark" x={x} y={padY - 12}>
              ×
            </text>
          )
        }
        if (fret === 0) {
          return (
            <circle
              key={`open-${string}`}
              className="chord-diagram-open"
              cx={x}
              cy={padY - 14}
              r={5}
            />
          )
        }
        if (barres.includes(fret) && fingers[string] === 1) {
          return null
        }
        const y = fretY(fret - 0.5)
        const finger = fingers[string]
        return (
          <g key={`dot-${string}`}>
            <circle className="chord-diagram-dot" cx={x} cy={y} r={9} />
            {finger > 0 ? (
              <text className="chord-diagram-finger" x={x} y={y + 4}>
                {finger}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}
