import { parseChordproMeta } from './chordproMeta'
import { isSecondarySongVersion } from './songVersions'

export type SongSummary = {
  id: string
  title: string
  artist: string
  key?: string
  capo?: number
  source: string
}

const songModules = import.meta.glob('../../songs/*.chordpro', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.chordpro$/i, '')
}

function loadAllSongs(): SongSummary[] {
  return Object.entries(songModules)
    .map(([path, source]) => {
      const id = idFromPath(path)
      const meta = parseChordproMeta(source, id)
      return {
        id,
        title: meta.title,
        artist: meta.artist,
        key: meta.key,
        capo: meta.capo,
        source,
      }
    })
    // Черновики: songs/_draft.chordpro (шаблон лежит в songs/templates/)
    .filter((song) => !song.id.startsWith('_'))
}

function sortSongs(list: SongSummary[]): SongSummary[] {
  return [...list].sort((a, b) => {
    const byArtist = a.artist.localeCompare(b.artist, 'ru')
    if (byArtist !== 0) return byArtist
    return a.title.localeCompare(b.title, 'ru')
  })
}

/** Все песни, включая скрытые вторичные версии (для открытия по URL). */
export const allSongs: SongSummary[] = sortSongs(loadAllSongs())

/** Список: без черновиков и без вторичных версий (кнопки версий — на странице). */
export const songs: SongSummary[] = sortSongs(
  allSongs.filter((song) => !isSecondarySongVersion(song.id)),
)

export function getSongById(id: string): SongSummary | undefined {
  return allSongs.find((song) => song.id === id)
}
