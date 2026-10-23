import type { SongSummary } from './songCatalog'

export type SortMode = 'artist' | 'title'

export function compareSongs(a: SongSummary, b: SongSummary, mode: SortMode): number {
  if (mode === 'title') {
    const byTitle = a.title.localeCompare(b.title, 'ru')
    if (byTitle !== 0) return byTitle
    return a.artist.localeCompare(b.artist, 'ru')
  }

  const byArtist = a.artist.localeCompare(b.artist, 'ru')
  if (byArtist !== 0) return byArtist
  return a.title.localeCompare(b.title, 'ru')
}
