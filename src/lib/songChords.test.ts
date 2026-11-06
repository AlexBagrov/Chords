import { describe, expect, it } from 'vitest'
import { formatChord } from './chords'
import { parseChordpro } from './chordproParse'
import { collectChordsByFrequency, collectUniqueChords } from './songChords'

describe('collectUniqueChords', () => {
  it('keeps first-seen order', () => {
    const ast = parseChordpro(`{title: T}
{artist: A}
[G]a [G/F#]b [G]c [Em]d
`)
    expect(collectUniqueChords(ast).map(formatChord)).toEqual(['G', 'G/F#', 'Em'])
  })

  it('can skip N.C. for diagram panel', () => {
    const ast = parseChordpro(`{title: T}
{artist: A}
[N.C.]x [G]y [D#]z
`)
    expect(collectUniqueChords(ast, { diagramsOnly: true }).map(formatChord)).toEqual([
      'G',
      'D#',
    ])
  })
})

describe('collectChordsByFrequency', () => {
  it('orders by frequency then first appearance', () => {
    const ast = parseChordpro(`{title: T}
{artist: A}
[G]a [D]b [G]c [Em]d [D]e [G]f
`)
    expect(collectChordsByFrequency(ast).map(formatChord)).toEqual([
      'G',
      'D',
      'Em',
    ])
  })
})
