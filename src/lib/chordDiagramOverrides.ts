import type { ChordPosition } from './chordDiagramLookup'

/**
 * Аппликатуры, которых нет в @tombatossals/chords-db.
 * Ключ = formatChord (канон после normalizeQuality).
 * Слэш не упрощаем до обычного мажора/минора.
 */
export const CHORD_DIAGRAM_OVERRIDES: Record<string, ChordPosition[]> = {
  // —— open E7: chords-db ставит 020100 первым; распространённее E+мизинец ——
  E7: [
    {
      // 022130 — как E, 7-я на 2-й струне
      frets: [0, 2, 2, 1, 3, 0],
      fingers: [0, 2, 3, 1, 4, 0],
      baseFret: 1,
      barres: [],
    },
    {
      // 020100 — упрощённый двухпальцевый
      frets: [0, 2, 0, 1, 0, 0],
      fingers: [0, 2, 0, 1, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],

  // —— major/minor slash ——
  // x22010 — C с басом B (walkdown)
  'C/B': [
    {
      frets: [-1, 2, 2, 0, 1, 0],
      fingers: [0, 2, 3, 0, 1, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  // x10033 — Gm с басом Bb
  'Gm/Bb': [
    {
      frets: [-1, 1, 0, 0, 3, 3],
      fingers: [0, 1, 0, 0, 3, 4],
      baseFret: 1,
      barres: [],
    },
  ],
  // 1x0231 — Dm с басом F
  'Dm/F': [
    {
      frets: [1, -1, 0, 2, 3, 1],
      fingers: [1, 0, 0, 3, 4, 2],
      baseFret: 1,
      barres: [],
    },
  ],
  // xx0111 — Fm с басом D
  'Fm/D': [
    {
      frets: [-1, -1, 0, 1, 1, 1],
      fingers: [0, 0, 0, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      capo: true,
    },
  ],
  // Hammer to Fall: x06454 (E triad over open A)
  'E/A': [
    {
      frets: [-1, 0, 3, 1, 2, 1],
      fingers: [0, 0, 4, 1, 3, 2],
      baseFret: 4,
      barres: [],
    },
  ],
  // x40232
  'D/C#': [
    {
      frets: [-1, 4, 0, 2, 3, 2],
      fingers: [0, 4, 0, 1, 3, 2],
      baseFret: 1,
      barres: [],
    },
  ],
  // 3x0232
  'D/G': [
    {
      frets: [3, -1, 0, 2, 3, 2],
      fingers: [2, 0, 0, 1, 3, 4],
      baseFret: 1,
      barres: [],
    },
  ],
  // x14322 (F# over A#/Bb)
  'F#/A#': [
    {
      frets: [-1, 1, 4, 3, 2, 2],
      fingers: [0, 1, 4, 3, 1, 1],
      baseFret: 1,
      barres: [2],
    },
  ],

  // —— complex quality + bass ——
  // x00212
  'D7/A': [
    {
      frets: [-1, 0, 0, 2, 1, 2],
      fingers: [0, 0, 0, 2, 1, 3],
      baseFret: 1,
      barres: [],
    },
  ],
  // 2x0212
  'D7/F#': [
    {
      frets: [2, -1, 0, 2, 1, 2],
      fingers: [2, 0, 0, 3, 1, 4],
      baseFret: 1,
      barres: [],
    },
  ],
  // 420100
  'E7/G#': [
    {
      frets: [4, 2, 0, 1, 0, 0],
      fingers: [4, 2, 0, 1, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  // 302000
  'Em7/G': [
    {
      frets: [3, 0, 2, 0, 0, 0],
      fingers: [3, 0, 2, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  // x44320
  'F#7/C#': [
    {
      frets: [-1, 4, 4, 3, 2, 0],
      fingers: [0, 3, 4, 2, 1, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  // 022222
  'F#m7/E': [
    {
      frets: [0, 2, 2, 2, 2, 2],
      fingers: [0, 1, 1, 1, 1, 1],
      baseFret: 1,
      barres: [2],
      capo: true,
    },
  ],
  // x20001
  'G7/B': [
    {
      frets: [-1, 2, 0, 0, 0, 1],
      fingers: [0, 2, 0, 0, 0, 1],
      baseFret: 1,
      barres: [],
    },
  ],
  // x123x3 — Edim over A#(=Bb)
  'Edim/A#': [
    {
      frets: [-1, 1, 2, 3, -1, 3],
      fingers: [0, 1, 2, 3, 0, 4],
      baseFret: 1,
      barres: [],
    },
  ],

  // —— major slash (нет в chords-db) ——
  // x03331
  'Bb/A': [
    {
      frets: [-1, 0, 3, 3, 3, 1],
      fingers: [0, 0, 2, 3, 4, 1],
      baseFret: 1,
      barres: [],
    },
  ],
  // 3x1343
  'Eb/G': [
    {
      frets: [3, -1, 1, 3, 4, 3],
      fingers: [2, 0, 1, 3, 4, 3],
      baseFret: 1,
      barres: [],
    },
  ],

  // —— power chords (5) ——
  A5: [
    {
      frets: [-1, 0, 2, 2, -1, -1],
      fingers: [0, 0, 1, 2, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  B5: [
    {
      frets: [-1, 2, 4, 4, -1, -1],
      fingers: [0, 1, 3, 4, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  C5: [
    {
      frets: [-1, 3, 5, 5, -1, -1],
      fingers: [0, 1, 3, 4, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  D5: [
    {
      frets: [-1, 1, 3, 3, -1, -1],
      fingers: [0, 1, 3, 4, 0, 0],
      baseFret: 5,
      barres: [],
    },
  ],
  E5: [
    {
      frets: [0, 2, 2, -1, -1, -1],
      fingers: [0, 1, 2, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  G5: [
    {
      frets: [3, 5, 5, -1, -1, -1],
      fingers: [1, 3, 4, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  F5: [
    {
      frets: [1, 3, 3, -1, -1, -1],
      fingers: [1, 3, 4, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'F#5': [
    {
      frets: [2, 4, 4, -1, -1, -1],
      fingers: [1, 3, 4, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'G#5': [
    {
      frets: [4, 6, 6, -1, -1, -1],
      fingers: [1, 3, 4, 0, 0, 0],
      baseFret: 1,
      barres: [],
    },
  ],

  // —— прочие слэши / сложные (корпус) ——
  'A/B': [
    {
      frets: [-1, 2, 2, 2, 2, 0],
      fingers: [0, 1, 1, 1, 1, 0],
      baseFret: 1,
      barres: [2],
      capo: true,
    },
  ],
  'A7/C#': [
    {
      frets: [-1, 4, 2, 0, 2, 0],
      fingers: [0, 4, 2, 0, 3, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'A#/D': [
    {
      frets: [-1, -1, 0, 3, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      baseFret: 1,
      barres: [],
    },
  ],
  'A#/F': [
    {
      frets: [1, 1, 3, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1],
      baseFret: 1,
      barres: [1],
      capo: true,
    },
  ],
  'Ab/D#': [
    {
      frets: [-1, 6, 5, 5, 4, -1],
      fingers: [0, 4, 2, 3, 1, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'Bb/Ab': [
    {
      frets: [4, -1, 3, 3, 3, -1],
      fingers: [2, 0, 1, 1, 1, 0],
      baseFret: 1,
      barres: [3],
    },
  ],
  'Bb/D': [
    {
      frets: [-1, -1, 0, 3, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      baseFret: 1,
      barres: [],
    },
  ],
  'Bb/F': [
    {
      frets: [1, 1, 3, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1],
      baseFret: 1,
      barres: [1],
      capo: true,
    },
  ],
  'Bbm/Db': [
    {
      frets: [-1, 1, 3, 3, 2, 1],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 1,
      barres: [1],
    },
  ],
  'Cm/A#': [
    {
      frets: [-1, 1, 1, 0, 1, -1],
      fingers: [0, 1, 2, 0, 3, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'D#/A#': [
    {
      frets: [-1, 1, 1, 3, 4, 3],
      fingers: [0, 1, 1, 2, 4, 3],
      baseFret: 1,
      barres: [1],
    },
  ],
  'D#/G': [
    {
      frets: [3, -1, 1, 3, 4, 3],
      fingers: [2, 0, 1, 3, 4, 3],
      baseFret: 1,
      barres: [],
    },
  ],
  'Eb6/G': [
    {
      frets: [3, -1, 1, 3, 1, 3],
      fingers: [2, 0, 1, 3, 1, 4],
      baseFret: 1,
      barres: [],
    },
  ],
  'F7/Eb': [
    {
      frets: [-1, -1, 1, 2, 1, 1],
      fingers: [0, 0, 1, 2, 1, 1],
      baseFret: 1,
      barres: [1],
    },
  ],
  'Fm6/C': [
    {
      frets: [-1, 3, -1, 1, 1, 1],
      fingers: [0, 3, 0, 1, 1, 1],
      baseFret: 1,
      barres: [1],
    },
  ],
  'Fmaj7/A': [
    {
      frets: [-1, 0, 3, 2, 1, 0],
      fingers: [0, 0, 3, 2, 1, 0],
      baseFret: 1,
      barres: [],
    },
  ],
  'G11/F': [
    {
      frets: [1, -1, 0, 0, 1, 1],
      fingers: [1, 0, 0, 0, 2, 3],
      baseFret: 1,
      barres: [],
    },
  ],
  Gadd11: [
    {
      frets: [3, 2, 0, 0, 1, 3],
      fingers: [3, 2, 0, 0, 1, 4],
      baseFret: 1,
      barres: [],
    },
  ],
}

export function lookupChordDiagramOverride(
  label: string,
): ChordPosition[] | null {
  const positions = CHORD_DIAGRAM_OVERRIDES[label]
  return positions?.length ? positions : null
}
