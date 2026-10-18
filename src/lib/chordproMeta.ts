export type ChordproMeta = {
  title: string
  artist: string
  key?: string
}

const META_LINE =
  /^\s*\{([a-zA-Z_]+)\s*:\s*([^}]*)\}\s*$/

/** Достаёт {title}, {artist}, {key} из текста ChordPro. */
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
  }

  return {
    title: meta.title || fallbackTitle,
    artist: meta.artist || 'Unknown',
    key: meta.key,
  }
}

/** Убирает служебные директивы для чернового просмотра до полного парсера. */
export function chordproBodyForPreview(source: string): string {
  return source
    .split(/\r?\n/)
    .filter((line) => {
      const t = line.trim()
      if (t.startsWith('{#') || t.startsWith('{title') || t.startsWith('{artist') || t.startsWith('{key')) {
        return false
      }
      return true
    })
    .join('\n')
    .trim()
}
