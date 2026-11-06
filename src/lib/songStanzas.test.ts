import { describe, expect, it } from 'vitest'
import type { SongBlock } from './chordproParse'
import { groupSongStanzas } from './songStanzas'

const line = (text: string): SongBlock => ({
  type: 'line',
  parts: [{ type: 'text', text }],
})

describe('groupSongStanzas', () => {
  it('groups section with following lines until next section', () => {
    const blocks: SongBlock[] = [
      { type: 'section', name: 'Verse 1' },
      line('a'),
      line('b'),
      { type: 'empty' },
      { type: 'section', name: 'Verse 2' },
      line('c'),
    ]

    expect(groupSongStanzas(blocks)).toEqual([
      [
        { type: 'section', name: 'Verse 1' },
        line('a'),
        line('b'),
        { type: 'empty' },
      ],
      [{ type: 'section', name: 'Verse 2' }, line('c')],
    ])
  })

  it('keeps leading lines without section as one stanza', () => {
    const blocks: SongBlock[] = [line('intro'), { type: 'empty' }, line('more')]
    expect(groupSongStanzas(blocks)).toEqual([blocks])
  })
})
