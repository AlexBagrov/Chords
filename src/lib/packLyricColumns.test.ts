import { describe, expect, it } from 'vitest'
import { getBoardAvailableHeightPx, packLyricColumns } from './packLyricColumns'

describe('packLyricColumns', () => {
  it('keeps stanzas in first column while they fit by height', () => {
    const pack = packLyricColumns([100, 100, 100], [200, 250, 180], 250, 400, {
      availableWidthPx: 900,
    })
    expect(pack.columns).toEqual([[0, 1], [2]])
    expect(pack.columnWidthsPx[0]).toBe(250)
    expect(pack.columnWidthsPx[1]).toBe(0)
  })

  it('caps first column width by max line budget', () => {
    const pack = packLyricColumns([50], [900], 400, 400)
    expect(pack.columnWidthsPx[0]).toBe(400)
  })

  it('moves whole stanza to next column when it does not fit', () => {
    const pack = packLyricColumns([200, 80], [220, 220], 220, 400, {
      availableWidthPx: 900,
    })
    expect(pack.columns).toEqual([[0], [1]])
  })

  it('keeps reading order: short outro after spill stays on the right', () => {
    const pack = packLyricColumns(
      [80, 80, 80, 80, 80, 80, 40],
      [200, 200, 200, 200, 200, 200, 200],
      320,
      400,
      { availableWidthPx: 900 },
    )
    expect(pack.columns[0]).toEqual([0, 1, 2, 3])
    expect(pack.columns[1]).toEqual([4, 5, 6])
  })

  it('opens a third column when two are not enough and width allows', () => {
    const heights = [100, 100, 100, 100, 100, 100]
    const widths = heights.map(() => 200)
    const pack = packLyricColumns(heights, widths, 220, 400, {
      availableWidthPx: 900,
      maxColumns: 3,
    })
    expect(pack.columns).toHaveLength(3)
    expect(pack.columns[0]).toEqual([0, 1])
    expect(pack.columns[1]).toEqual([2, 3])
    expect(pack.columns[2]).toEqual([4, 5])
    expect(pack.columnWidthsPx[2]).toBe(0)
  })

  it('stays at two columns when board is too narrow for three', () => {
    const heights = [100, 100, 100, 100, 100, 100]
    const widths = heights.map(() => 200)
    const pack = packLyricColumns(heights, widths, 220, 400, {
      availableWidthPx: 400,
      maxColumns: 3,
    })
    expect(pack.columns.length).toBeLessThanOrEqual(2)
  })

  it('does not overfill the first column past available height', () => {
    // Как на скрине: много куплетов, во второй колонке ещё есть место.
    const heights = [120, 120, 120, 120, 120, 120, 80, 80, 80]
    const widths = heights.map(() => 220)
    const pack = packLyricColumns(heights, widths, 400, 400, {
      availableWidthPx: 1000,
      maxColumns: 3,
    })
    const leftHeight = pack.columns[0]!.reduce(
      (sum, index) => sum + heights[index]!,
      0,
    )
    expect(leftHeight).toBeLessThanOrEqual(400)
    expect(pack.columns.length).toBeGreaterThan(1)
  })
})

describe('getBoardAvailableHeightPx', () => {
  it('caps by CSS max-height when it is smaller than viewport room', () => {
    const board = {
      getBoundingClientRect: () => ({ top: 100 }),
    } as HTMLElement

    const originalInnerHeight = window.innerHeight
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })

    const originalGetComputedStyle = window.getComputedStyle
    window.getComputedStyle = (() =>
      ({ maxHeight: '500px' }) as CSSStyleDeclaration) as typeof getComputedStyle

    expect(getBoardAvailableHeightPx(board)).toBe(Math.floor(500 * 0.97))

    window.getComputedStyle = originalGetComputedStyle
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      configurable: true,
    })
  })
})
