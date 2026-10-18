import { describe, expect, it } from 'vitest'
import { chordproBodyForPreview, parseChordproMeta } from './chordproMeta'

const SAMPLE = `{title: Life Is Real}
{artist: Queen}
{key: G}
{# note }
{comment: Verse 1}
[G]Guilt stains
`

describe('parseChordproMeta', () => {
  it('reads title, artist, key', () => {
    expect(parseChordproMeta(SAMPLE, 'fallback')).toEqual({
      title: 'Life Is Real',
      artist: 'Queen',
      key: 'G',
    })
  })

  it('uses fallback title when missing', () => {
    expect(parseChordproMeta('[G]hi', 'life-is-real')).toEqual({
      title: 'life-is-real',
      artist: 'Unknown',
      key: undefined,
    })
  })
})

describe('chordproBodyForPreview', () => {
  it('drops meta and keeps body', () => {
    const body = chordproBodyForPreview(SAMPLE)
    expect(body).toContain('{comment: Verse 1}')
    expect(body).toContain('[G]Guilt stains')
    expect(body).not.toContain('{title:')
    expect(body).not.toContain('{# note')
  })
})
