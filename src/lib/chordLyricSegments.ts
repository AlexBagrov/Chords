import type { Chord } from './chords'
import type { InlinePart } from './chordproParse'

export type ChordLyricSegment = {
  chord: Chord | null
  /** Текст под аккордом; пробелы-разделители сюда не кладём. */
  lyric: string
  /** Горизонтальный зазор после сегмента (в «символах» пробела). */
  padAfter: number
}

function isWhitespaceOnly(text: string): boolean {
  return text.length > 0 && /^\s+$/.test(text)
}

/**
 * Собирает сегменты аккорд+текст для строки.
 * Пробелы между аккордами ([D] [G] [A]) и подряд идущие [D][G]
 * дают padAfter, чтобы в UI не слипалось в «DGA».
 */
export function buildChordLyricSegments(parts: InlinePart[]): ChordLyricSegment[] {
  const segments: ChordLyricSegment[] = []
  let pendingChord: Chord | null = null

  for (const part of parts) {
    if (part.type === 'chord') {
      if (pendingChord) {
        segments.push({ chord: pendingChord, lyric: '', padAfter: 1 })
      }
      pendingChord = part.chord
      continue
    }

    if (pendingChord) {
      if (isWhitespaceOnly(part.text)) {
        segments.push({
          chord: pendingChord,
          lyric: '',
          padAfter: Math.max(1, part.text.length),
        })
      } else {
        segments.push({ chord: pendingChord, lyric: part.text, padAfter: 0 })
      }
      pendingChord = null
    } else if (segments.length === 0) {
      segments.push({ chord: null, lyric: part.text, padAfter: 0 })
    } else {
      segments[segments.length - 1].lyric += part.text
    }
  }

  if (pendingChord) {
    segments.push({ chord: pendingChord, lyric: '', padAfter: 0 })
  }

  return segments
}
