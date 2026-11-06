import { formatChord, type Chord } from './chords'
import type { SongAst } from './chordproParse'

/** Есть ли смысл искать схему (не N.C. и не «сырой» токен). */
export function isDiagramChord(chord: Chord): boolean {
  if (chord.raw !== undefined) {
    return false
  }
  return !/^n\.?c\.?$/i.test(formatChord(chord))
}

/** Уникальные аккорды песни в порядке первого появления. */
export function collectUniqueChords(
  song: SongAst,
  options?: { diagramsOnly?: boolean },
): Chord[] {
  const seen = new Set<string>()
  const result: Chord[] = []

  for (const block of song.blocks) {
    if (block.type !== 'line') continue
    for (const part of block.parts) {
      if (part.type !== 'chord') continue
      if (options?.diagramsOnly && !isDiagramChord(part.chord)) continue
      const label = formatChord(part.chord)
      if (seen.has(label)) continue
      seen.add(label)
      result.push(part.chord)
    }
  }

  return result
}

/** Уникальные аккорды по убыванию частоты (при равенстве — кто раньше встретился). */
export function collectChordsByFrequency(
  song: SongAst,
  options?: { diagramsOnly?: boolean },
): Chord[] {
  const stats = new Map<string, { chord: Chord; count: number; firstIndex: number }>()
  let index = 0

  for (const block of song.blocks) {
    if (block.type !== 'line') continue
    for (const part of block.parts) {
      if (part.type !== 'chord') continue
      if (options?.diagramsOnly && !isDiagramChord(part.chord)) continue
      const label = formatChord(part.chord)
      const existing = stats.get(label)
      if (existing) {
        existing.count += 1
      } else {
        stats.set(label, { chord: part.chord, count: 1, firstIndex: index })
      }
      index += 1
    }
  }

  return [...stats.values()]
    .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
    .map((entry) => entry.chord)
}
