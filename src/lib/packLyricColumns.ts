export type LyricColumnPack = {
  /** Индексы куплетов по колонкам (1–3), слева направо, порядок чтения сохранён. */
  columns: number[][]
  /**
   * Ширина колонок в px. Для последней колонки — 0 (растягивается на остаток).
   * Для остальных — по самой длинной строке внутри колонки.
   */
  columnWidthsPx: number[]
}

const COLUMN_GAP_PX = 40 // ~2.5rem
const MIN_COL_WIDTH_PX = 160
const DEFAULT_MAX_COLUMNS = 3

export type PackLyricColumnsOptions = {
  maxColumns?: number
  /** Ширина области текста — чтобы понять, влезут ли 3 колонки. */
  availableWidthPx?: number
}

function resolveMaxColumns(
  availableWidthPx: number | undefined,
  requested: number,
): number {
  if (availableWidthPx == null || !Number.isFinite(availableWidthPx)) {
    return Math.min(requested, DEFAULT_MAX_COLUMNS)
  }

  for (let cols = Math.min(requested, DEFAULT_MAX_COLUMNS); cols >= 1; cols -= 1) {
    const need = MIN_COL_WIDTH_PX * cols + COLUMN_GAP_PX * Math.max(0, cols - 1)
    if (availableWidthPx >= need) return cols
  }
  return 1
}

/**
 * Раскладывает куплеты в 1–3 колонки по высоте экрана.
 * Перенос только вперёд (порядок чтения). Третья колонка — если есть
 * горизонтальное место и контент не влез в две.
 */
export function packLyricColumns(
  stanzaHeights: number[],
  stanzaMaxLineWidths: number[],
  availableHeightPx: number,
  maxLineWidthPx: number,
  options: PackLyricColumnsOptions = {},
): LyricColumnPack {
  const maxColumns = resolveMaxColumns(
    options.availableWidthPx,
    options.maxColumns ?? DEFAULT_MAX_COLUMNS,
  )

  const columns: number[][] = Array.from({ length: maxColumns }, () => [])
  const heights = Array.from({ length: maxColumns }, () => 0)
  let currentCol = 0

  for (let index = 0; index < stanzaHeights.length; index += 1) {
    const height = stanzaHeights[index] ?? 0
    const isEmptyCol = columns[currentCol]!.length === 0
    const fitsCurrent =
      isEmptyCol || heights[currentCol]! + height <= availableHeightPx + 0.5

    if (fitsCurrent) {
      columns[currentCol]!.push(index)
      heights[currentCol]! += height
      continue
    }

    if (currentCol < maxColumns - 1) {
      currentCol += 1
      columns[currentCol]!.push(index)
      heights[currentCol]! += height
      continue
    }

    // Последняя колонка: кладём всё оставшееся (при переполнении — прокрутка)
    columns[currentCol]!.push(index)
    heights[currentCol]! += height
  }

  const usedColumns = columns.filter((col) => col.length > 0)
  const columnWidthsPx = usedColumns.map((colIndexes, colIndex) => {
    const isLast = colIndex === usedColumns.length - 1
    if (isLast && usedColumns.length > 1) return 0

    let width = MIN_COL_WIDTH_PX
    for (const stanzaIndex of colIndexes) {
      const lineWidth = stanzaMaxLineWidths[stanzaIndex] ?? 0
      width = Math.max(width, Math.min(lineWidth, maxLineWidthPx))
    }
    return Math.ceil(width)
  })

  return {
    columns: usedColumns,
    columnWidthsPx,
  }
}

export function maxLineWidthBudgetPx(
  viewportWidth = window.innerWidth,
  columnCount = 2,
  availableWidthPx?: number,
): number {
  const byViewport = Math.floor(viewportWidth * 0.45)
  if (availableWidthPx == null || columnCount <= 1) {
    return byViewport
  }
  const byBoard = Math.floor(
    (availableWidthPx - COLUMN_GAP_PX * (columnCount - 1)) / columnCount,
  )
  return Math.max(MIN_COL_WIDTH_PX, Math.min(byViewport, byBoard))
}

export { COLUMN_GAP_PX, MIN_COL_WIDTH_PX }
