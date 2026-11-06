import { describe, expect, it } from 'vitest'
import { packLyricColumns } from './packLyricColumns'

describe('packLyricColumns', () => {
  it('keeps stanzas in left while they fit by height', () => {
    const pack = packLyricColumns([100, 100, 100], [200, 250, 180], 250, 400)
    expect(pack.leftIndexes).toEqual([0, 1])
    expect(pack.rightIndexes).toEqual([2])
    expect(pack.leftWidthPx).toBe(250)
  })

  it('caps left width by max line budget', () => {
    const pack = packLyricColumns([50], [900], 400, 400)
    expect(pack.leftWidthPx).toBe(400)
  })

  it('moves whole stanza to right when it does not fit left remainder', () => {
    const pack = packLyricColumns([200, 80], [220, 220], 220, 400)
    expect(pack.leftIndexes).toEqual([0])
    expect(pack.rightIndexes).toEqual([1])
  })
})
