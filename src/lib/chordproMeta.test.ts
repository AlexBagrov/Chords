import { describe, expect, it } from 'vitest'
import { chordproBodyForPreview, parseChordproMeta } from './chordproMeta'

const SAMPLE = `{title: Life Is Real}
{artist: Queen}
{key: G}
{# note }
{comment: Verse 1}
[G]Guilt stains
`

const WITH_CAPO = `{title: Hammer to Fall}
{artist: Queen}
{key: A}
{capo: 3}
`

describe('parseChordproMeta', () => {
  it('reads title, artist, key', () => {
    expect(parseChordproMeta(SAMPLE, 'fallback')).toEqual({
      title: 'Life Is Real',
      artist: 'Queen',
      key: 'G',
      capo: undefined,
    })
  })

  it('reads capo fret', () => {
    expect(parseChordproMeta(WITH_CAPO, 'fallback')).toEqual({
      title: 'Hammer to Fall',
      artist: 'Queen',
      key: 'A',
      capo: 3,
    })
  })

  it('uses fallback title when missing', () => {
    expect(parseChordproMeta('[G]hi', 'life-is-real')).toEqual({
      title: 'life-is-real',
      artist: 'Unknown',
      key: undefined,
      capo: undefined,
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
