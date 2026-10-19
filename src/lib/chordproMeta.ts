export type ChordproMeta = {
  title: string
  artist: string
  key?: string
  /** Лад каподастра; формы аккордов в файле — относительно капо. */
  capo?: number
}

const META_LINE =
  /^\s*\{([a-zA-Z_]+)\s*:\s*([^}]*)\}\s*$/

function parseCapoFret(value: string): number | undefined {
  const n = Number.parseInt(value.trim(), 10)
  if (!Number.isFinite(n) || n < 1 || n > 12) return undefined
  return n
}

/** Достаёт {title}, {artist}, {key}, {capo} из текста ChordPro. */
export function parseChordproMeta(
  source: string,
  fallbackTitle: string,
): ChordproMeta {
  const meta: Partial<ChordproMeta> = {}

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed.startsWith('{#') || trimmed.startsWith('{comment')) {
      continue
    }

    const match = META_LINE.exec(trimmed)
    if (!match) {
      continue
    }

    const key = match[1].toLowerCase()
    const value = match[2].trim()
    if (key === 'title') meta.title = value
    if (key === 'artist') meta.artist = value
    if (key === 'key') meta.key = value
    if (key === 'capo') meta.capo = parseCapoFret(value)
  }

  return {
    title: meta.title || fallbackTitle,
    artist: meta.artist || 'Unknown',
    key: meta.key,
    capo: meta.capo,
  }
}

/** Убирает служебные директивы для чернового просмотра до полного парсера. */
export function chordproBodyForPreview(source: string): string {
  return source
    .split(/\r?\n/)
    .filter((line) => {
      const t = line.trim()
      if (
        t.startsWith('{#') ||
        t.startsWith('{title') ||
        t.startsWith('{artist') ||
        t.startsWith('{key') ||
        t.startsWith('{capo')
      ) {
        return false
      }
      return true
    })
    .join('\n')
    .trim()
}
