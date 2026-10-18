import { describe, expect, it } from 'vitest'
import { formatChord } from './chords'
import { parseChordpro, transposeSong } from './chordproParse'

const FRAGMENT = `{title: Life Is Real}
{artist: Queen}
{key: G}
{# note }
{comment: Verse 1}
[G]Guilt stains [G/F#]on my [Em]pillow [D]
I will price it

{comment: Chorus}
Life is [D]real, [C]life is [D]real, [C]life is [F]real [C] [F] [C]
`

describe('parseChordpro', () => {
  it('reads meta and verse line parts', () => {
    const ast = parseChordpro(FRAGMENT)
    expect(ast.meta).toEqual({
      title: 'Life Is Real',
      artist: 'Queen',
      key: 'G',
    })

    expect(ast.blocks[0]).toEqual({ type: 'section', name: 'Verse 1' })

    const line = ast.blocks[1]
    expect(line.type).toBe('line')
    if (line.type !== 'line') return

    expect(
      line.parts.map((part) =>
        part.type === 'chord' ? `chord:${formatChord(part.chord)}` : `text:${part.text}`,
      ),
    ).toEqual([
      'chord:G',
      'text:Guilt stains ',
      'chord:G/F#',
      'text:on my ',
      'chord:Em',
      'text:pillow ',
      'chord:D',
    ])
  })

  it('keeps plain lyric lines', () => {
    const ast = parseChordpro(FRAGMENT)
    const plain = ast.blocks.find(
      (block) =>
        block.type === 'line' &&
        block.parts.length === 1 &&
        block.parts[0].type === 'text' &&
        block.parts[0].text.includes('I will price it'),
    )
    expect(plain).toBeTruthy()
  })
})

describe('transposeSong', () => {
  it('transposes chords and keeps texts/sections', () => {
    const ast = transposeSong(parseChordpro(FRAGMENT), 2)
    expect(ast.blocks[0]).toEqual({ type: 'section', name: 'Verse 1' })

    const line = ast.blocks[1]
    expect(line.type).toBe('line')
    if (line.type !== 'line') return

    const chords = line.parts
      .filter((part) => part.type === 'chord')
      .map((part) => (part.type === 'chord' ? formatChord(part.chord) : ''))

    expect(chords).toEqual(['A', 'A/G#', 'F#m', 'E'])
    expect(line.parts.some((part) => part.type === 'text' && part.text === 'Guilt stains ')).toBe(
      true,
    )
  })
})
