export type Chord = {
  root: string
  accidental: '' | '#' | 'b'
  quality: string
  bass?: {
    root: string
    accidental: '' | '#' | 'b'
  }
  /** Исходная строка, если разобрать не удалось */
  raw?: string
}

const NOTE_NAMES_SHARP = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

const NOTE_NAMES_FLAT = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
}

const CHORD_RE =
  /^([A-G])([#b]?)([^/]*)(?:\/([A-G])([#b]?))?$/

function noteName(
  index: number,
  preferFlats: boolean,
): { root: string; accidental: '' | '#' | 'b' } {
  const name = preferFlats
    ? NOTE_NAMES_FLAT[((index % 12) + 12) % 12]
    : NOTE_NAMES_SHARP[((index % 12) + 12) % 12]

  if (name.length === 1) {
    return { root: name, accidental: '' }
  }
  return {
    root: name[0],
    accidental: name[1] as '#' | 'b',
  }
}

function pitchIndex(root: string, accidental: '' | '#' | 'b'): number | null {
  const key = `${root}${accidental}`
  const index = NOTE_TO_INDEX[key]
  return index === undefined ? null : index
}

export function parseChord(token: string): Chord {
  const trimmed = token.trim()
  const match = CHORD_RE.exec(trimmed)
  if (!match) {
    return {
      root: '',
      accidental: '',
      quality: '',
      raw: trimmed,
    }
  }

  const chord: Chord = {
    root: match[1],
    accidental: (match[2] || '') as '' | '#' | 'b',
    quality: match[3] ?? '',
  }

  if (match[4]) {
    chord.bass = {
      root: match[4],
      accidental: (match[5] || '') as '' | '#' | 'b',
    }
  }

  return chord
}

export function formatChord(chord: Chord): string {
  if (chord.raw !== undefined) {
    return chord.raw
  }

  let out = `${chord.root}${chord.accidental}${chord.quality}`
  if (chord.bass) {
    out += `/${chord.bass.root}${chord.bass.accidental}`
  }
  return out
}

function prefersFlats(chord: Chord): boolean {
  if (chord.accidental === 'b') return true
  if (chord.bass?.accidental === 'b') return true
  return false
}

export function transposeChord(chord: Chord, steps: number): Chord {
  if (chord.raw !== undefined || !chord.root) {
    return { ...chord }
  }

  const preferFlat = prefersFlats(chord)
  const rootIndex = pitchIndex(chord.root, chord.accidental)
  if (rootIndex === null) {
    return { ...chord, raw: formatChord(chord) }
  }

  const nextRoot = noteName(rootIndex + steps, preferFlat)
  const next: Chord = {
    root: nextRoot.root,
    accidental: nextRoot.accidental,
    quality: chord.quality,
  }

  if (chord.bass) {
    const bassIndex = pitchIndex(chord.bass.root, chord.bass.accidental)
    if (bassIndex === null) {
      return { ...chord, raw: formatChord(chord) }
    }
    const nextBass = noteName(bassIndex + steps, preferFlat)
    next.bass = {
      root: nextBass.root,
      accidental: nextBass.accidental,
    }
  }

  return next
}

/** Сдвиг подписи тональности (`G`, `Am`); при ошибке — undefined. */
export function transposeKeyLabel(
  key: string | undefined,
  steps: number,
): string | undefined {
  if (!key) return undefined
  const chord = parseChord(key.trim())
  if (chord.raw !== undefined || !chord.root) return key
  return formatChord(transposeChord(chord, steps))
}

export function formatTransposeSteps(steps: number): string {
  if (steps === 0) return '0'
  return steps > 0 ? `+${steps}` : `${steps}`
}

