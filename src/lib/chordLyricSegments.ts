import { formatChord, type Chord } from './chords'
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
 * Если под аккордом мало букв, следующий аккорд визуально слипается (Cadd9G).
 * Нужен зазор: длина имени − длина текста + 1.
 */
function collisionPad(chord: Chord, lyric: string): number {
  const nameLen = formatChord(chord).length
  const lyricLen = lyric.length
  if (lyricLen > nameLen) return 0
  return nameLen - lyricLen + 1
}

/**
 * Собирает сегменты аккорд+текст для строки.
 * Пробелы между аккордами ([D] [G] [A]) и подряд идущие [D][G]
 * дают padAfter, чтобы в UI не слипалось в «DGA».
 * Короткие слоги под длинным аккордом тоже разводятся.
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

  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]
    const next = segments[i + 1]
    // Пустой lyric уже разведён выше (padAfter ≥ 1).
    if (!seg.chord || !next.chord || seg.lyric.length === 0) continue
    seg.padAfter = Math.max(seg.padAfter, collisionPad(seg.chord, seg.lyric))
  }

  return segments
}
