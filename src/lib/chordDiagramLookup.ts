import guitarDb from '@tombatossals/chords-db/lib/guitar.json'
import { formatChord, type Chord } from './chords'
import { lookupChordDiagramOverride } from './chordDiagramOverrides'

/** Сколько вариаций аппликатуры показываем (стрелками). */
export const MAX_CHORD_VARIATIONS = 2

export type ChordPosition = {
  frets: number[]
  fingers: number[]
  baseFret: number
  barres: number[]
  capo?: boolean
}

export type ChordDiagramMatch = {
  label: string
  lookupKey: string
  suffix: string
  /** 1–2 самые «популярные» формы из базы (порядок chords-db). */
  positions: ChordPosition[]
}

type DbChord = {
  key: string
  suffix: string
  positions: ChordPosition[]
}

type GuitarDb = {
  chords: Record<string, DbChord[]>
}

const db = guitarDb as GuitarDb

const KEY_TO_DB: Record<string, string> = {
  C: 'C',
  'C#': 'Csharp',
  Db: 'Csharp',
  D: 'D',
  'D#': 'Eb',
  Eb: 'Eb',
  E: 'E',
  F: 'F',
  'F#': 'Fsharp',
  Gb: 'Fsharp',
  G: 'G',
  'G#': 'Ab',
  Ab: 'Ab',
  A: 'A',
  'A#': 'Bb',
  Bb: 'Bb',
  B: 'B',
}

/** Имена баса в суффиксах chords-db (`/F#`, `m/B`, …). */
const BASS_TO_SUFFIX: Record<string, string> = {
  C: 'C',
  'C#': 'C#',
  Db: 'C#',
  D: 'D',
  'D#': 'D#',
  Eb: 'D#',
  E: 'E',
  F: 'F',
  'F#': 'F#',
  Gb: 'F#',
  G: 'G',
  'G#': 'G#',
  Ab: 'G#',
  A: 'A',
  'A#': 'Bb',
  Bb: 'Bb',
  B: 'B',
}

const QUALITY_TO_SUFFIX: Record<string, string> = {
  '': 'major',
  maj: 'major',
  M: 'major',
  m: 'minor',
  min: 'minor',
  add9: 'add9',
  madd9: 'madd9',
  maj7: 'maj7',
  M7: 'maj7',
  m7: 'm7',
  m7b5: 'm7b5',
  '7': '7',
  sus2: 'sus2',
  sus4: 'sus4',
  // после normalizeQuality('sus') → sus4; оставляем на случай ручного Chord
  sus: 'sus4',
  dim: 'dim',
  dim7: 'dim7',
  aug: 'aug',
  aug7: 'aug7',
  '7#5': 'aug7',
  '7b5': '7b5',
  '6': '6',
  m6: 'm6',
  '9': '9',
  m9: 'm9',
  '11': '11',
  '13': '13',
  '7sus4': '7sus4',
  add11: 'add11',
  // Emaug в файлах → quality maug; берём maj aug из db
  maug: 'aug',
}

function pitchName(root: string, accidental: '' | '#' | 'b'): string {
  return `${root}${accidental}`
}

function normalizePosition(position: ChordPosition): ChordPosition {
  return {
    frets: position.frets,
    fingers: position.fingers,
    baseFret: position.baseFret,
    barres: position.barres ?? [],
    capo: position.capo,
  }
}

export function qualityToSuffix(quality: string): string | undefined {
  if (quality in QUALITY_TO_SUFFIX) {
    return QUALITY_TO_SUFFIX[quality]
  }
  return undefined
}

/**
 * Суффикс в chords-db.
 * Слэш-аккорды: `G/F#` → `/F#`, `Am/G` → `m/G`.
 * Без подмены слэша обычной формой мажора/минора.
 */
export function chordToDbSuffix(chord: Chord): string | undefined {
  if (chord.bass) {
    const bassPitch =
      BASS_TO_SUFFIX[pitchName(chord.bass.root, chord.bass.accidental)]
    if (!bassPitch) {
      return undefined
    }

    const quality = chord.quality
    if (quality === '' || quality === 'maj' || quality === 'M') {
      return `/${bassPitch}`
    }
    if (quality === 'm' || quality === 'min') {
      return `m/${bassPitch}`
    }
    return undefined
  }

  return qualityToSuffix(chord.quality)
}

export function lookupChordDiagram(chord: Chord): ChordDiagramMatch | null {
  if (chord.raw || !chord.root) {
    return null
  }

  const pitch = pitchName(chord.root, chord.accidental)
  const label = formatChord(chord)

  const override = lookupChordDiagramOverride(label)
  if (override) {
    return {
      label,
      lookupKey: pitch,
      suffix: 'override',
      positions: override.slice(0, MAX_CHORD_VARIATIONS).map(normalizePosition),
    }
  }

  const dbKey = KEY_TO_DB[pitch]
  const suffix = chordToDbSuffix(chord)
  if (!dbKey || !suffix) {
    return null
  }

  const entry = db.chords[dbKey]?.find((item) => item.suffix === suffix)
  if (!entry?.positions.length) {
    return null
  }

  const positions = entry.positions
    .slice(0, MAX_CHORD_VARIATIONS)
    .map(normalizePosition)

  return {
    label,
    lookupKey: pitch,
    suffix,
    positions,
  }
}
