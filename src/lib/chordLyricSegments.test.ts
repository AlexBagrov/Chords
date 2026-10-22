import { describe, expect, it } from 'vitest'
import { formatChord } from './chords'
import { parseChordpro } from './chordproParse'
import { buildChordLyricSegments } from './chordLyricSegments'

function lineParts(source: string) {
  const ast = parseChordpro(`{title: t}\n{artist: a}\n${source}`)
  const line = ast.blocks.find((block) => block.type === 'line')
  if (!line || line.type !== 'line') {
    throw new Error('expected a lyric line')
  }
  return line.parts
}

function summary(parts: ReturnType<typeof lineParts>) {
  return buildChordLyricSegments(parts).map((segment) => ({
    chord: segment.chord ? formatChord(segment.chord) : null,
    lyric: segment.lyric,
    padAfter: segment.padAfter,
  }))
}

describe('buildChordLyricSegments', () => {
  it('keeps spaces between spaced intro chords', () => {
    expect(summary(lineParts('[D] [G] [A]'))).toEqual([
      { chord: 'D', lyric: '', padAfter: 1 },
      { chord: 'G', lyric: '', padAfter: 1 },
      { chord: 'A', lyric: '', padAfter: 0 },
    ])
  })

  it('inserts gaps for stuck chords without spaces', () => {
    expect(summary(lineParts('[D][G][A]'))).toEqual([
      { chord: 'D', lyric: '', padAfter: 1 },
      { chord: 'G', lyric: '', padAfter: 1 },
      { chord: 'A', lyric: '', padAfter: 0 },
    ])
  })

  it('does not pad chords that carry lyrics', () => {
    expect(summary(lineParts('[D]Two packs [G]of beer'))).toEqual([
      { chord: 'D', lyric: 'Two packs ', padAfter: 0 },
      { chord: 'G', lyric: 'of beer', padAfter: 0 },
    ])
  })
})
