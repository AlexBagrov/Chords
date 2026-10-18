import { useState } from 'react'
import { lookupChordDiagram } from '../lib/chordDiagramLookup'
import { formatChord, type Chord } from '../lib/chords'
import { collectUniqueChords } from '../lib/songChords'
import type { SongAst } from '../lib/chordproParse'
import ChordDiagram from './ChordDiagram'

type ChordDiagramPanelProps = {
  song: SongAst
}

export default function ChordDiagramPanel({ song }: ChordDiagramPanelProps) {
  const chords = collectUniqueChords(song, { diagramsOnly: true })

  if (chords.length === 0) {
    return null
  }

  return (
    <aside className="chord-diagram-panel" aria-label="Схемы аккордов">
      <h2 className="chord-diagram-panel-title">Аккорды</h2>
      <div className="chord-diagram-grid">
        {chords.map((chord) => (
          <ChordDiagramCard chord={chord} key={formatChord(chord)} />
        ))}
      </div>
    </aside>
  )
}

function ChordDiagramCard({ chord }: { chord: Chord }) {
  const label = formatChord(chord)
  const match = lookupChordDiagram(chord)
  const [variationIndex, setVariationIndex] = useState(0)

  if (!match) {
    return (
      <div className="chord-diagram-card">
        <div className="chord-diagram-card-label">{label}</div>
        <p className="muted chord-diagram-missing">Схема не найдена</p>
      </div>
    )
  }

  const count = match.positions.length
  const index = Math.min(variationIndex, count - 1)
  const position = match.positions[index]
  const canSwitch = count > 1

  return (
    <div className="chord-diagram-card">
      <div className="chord-diagram-card-label">{label}</div>
      <ChordDiagram position={position} />
      {canSwitch ? (
        <div className="chord-variation-controls">
          <button
            type="button"
            className="chord-variation-btn"
            aria-label={`Предыдущая вариация ${label}`}
            disabled={index === 0}
            onClick={() => setVariationIndex((value) => Math.max(0, value - 1))}
          >
            ‹
          </button>
          <span className="chord-variation-meta" aria-live="polite">
            {index + 1}/{count}
          </span>
          <button
            type="button"
            className="chord-variation-btn"
            aria-label={`Следующая вариация ${label}`}
            disabled={index >= count - 1}
            onClick={() =>
              setVariationIndex((value) => Math.min(count - 1, value + 1))
            }
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  )
}
