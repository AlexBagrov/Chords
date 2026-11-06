export type LyricColumnPack = {
  leftIndexes: number[]
  rightIndexes: number[]
  leftWidthPx: number
}

const COLUMN_GAP_PX = 40 // ~2.5rem
const MIN_LEFT_WIDTH_PX = 160

/**
 * Раскладывает куплеты в две колонки по высоте и ширине самой длинной
 * строки, реально попавшей в левую колонку (не больше maxLineWidthPx).
 */
export function packLyricColumns(
  stanzaHeights: number[],
  stanzaMaxLineWidths: number[],
  availableHeightPx: number,
  maxLineWidthPx: number,
): LyricColumnPack {
  const leftIndexes: number[] = []
  const rightIndexes: number[] = []
  let leftHeight = 0
  // После первого переноса всё остальное только вправо — иначе короткий
  // хвост (outro) снова влезет слева и окажется «до» продолжения справа.
  let spilledToRight = false

  for (let index = 0; index < stanzaHeights.length; index += 1) {
    const height = stanzaHeights[index] ?? 0
    const fitsLeft =
      !spilledToRight &&
      (leftIndexes.length === 0 ||
        leftHeight + height <= availableHeightPx + 0.5)

    if (fitsLeft) {
      leftIndexes.push(index)
      leftHeight += height
    } else {
      spilledToRight = true
      rightIndexes.push(index)
    }
  }

  let leftWidthPx = MIN_LEFT_WIDTH_PX
  for (const index of leftIndexes) {
    const width = stanzaMaxLineWidths[index] ?? 0
    leftWidthPx = Math.max(leftWidthPx, Math.min(width, maxLineWidthPx))
  }

  // Если правой колонки нет — не раздуваем зря
  if (rightIndexes.length === 0) {
    leftWidthPx = Math.min(
      leftWidthPx,
      Math.max(MIN_LEFT_WIDTH_PX, maxLineWidthPx),
    )
  }

  return {
    leftIndexes,
    rightIndexes,
    leftWidthPx: Math.ceil(leftWidthPx),
  }
}

export function maxLineWidthBudgetPx(viewportWidth = window.innerWidth): number {
  return Math.floor(viewportWidth * 0.45)
}

export { COLUMN_GAP_PX }
