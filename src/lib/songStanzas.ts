import type { SongBlock } from './chordproParse'

/**
 * Группы «абзацев» песни: секция + строки до следующей секции.
 * Нужно, чтобы куплет целиком уходил во вторую колонку, а не рвался после заголовка.
 */
export function groupSongStanzas(blocks: SongBlock[]): SongBlock[][] {
  const stanzas: SongBlock[][] = []
  let current: SongBlock[] = []

  for (const block of blocks) {
    if (block.type === 'section' && current.length > 0) {
      stanzas.push(current)
      current = [block]
      continue
    }
    current.push(block)
  }

  if (current.length > 0) {
    stanzas.push(current)
  }

  return stanzas
}
