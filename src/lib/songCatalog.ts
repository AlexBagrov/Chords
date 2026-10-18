import { parseChordproMeta } from './chordproMeta'

export type SongSummary = {
  id: string
  title: string
  artist: string
  key?: string
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

function loadSongs(): SongSummary[] {
  const songs = Object.entries(songModules)
    .map(([path, source]) => {
      const id = idFromPath(path)
      const meta = parseChordproMeta(source, id)
      return {
        id,
        title: meta.title,
        artist: meta.artist,
        key: meta.key,
        source,
      }
    })
    // Черновики: songs/_draft.chordpro (шаблон лежит в songs/templates/)
    .filter((song) => !song.id.startsWith('_'))

  return songs.sort((a, b) => {
    const byArtist = a.artist.localeCompare(b.artist, 'ru')
    if (byArtist !== 0) return byArtist
    return a.title.localeCompare(b.title, 'ru')
  })
}

export const songs: SongSummary[] = loadSongs()

export function getSongById(id: string): SongSummary | undefined {
  return songs.find((song) => song.id === id)
}
