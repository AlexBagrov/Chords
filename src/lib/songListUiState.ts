import type { SortMode } from './songListSort'

export type SongListUiState = {
  artist: string | null
  sort: SortMode
  scrollY: number
}

const STORAGE_KEY = 'chords:song-list-ui'

const DEFAULT_STATE: SongListUiState = {
  artist: null,
  sort: 'artist',
  scrollY: 0,
}

function isSortMode(value: unknown): value is SortMode {
  return value === 'artist' || value === 'title'
}

export function readSongListUiState(): SongListUiState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }

    const parsed = JSON.parse(raw) as Partial<SongListUiState>
    return {
      artist: typeof parsed.artist === 'string' ? parsed.artist : null,
      sort: isSortMode(parsed.sort) ? parsed.sort : 'artist',
      scrollY: typeof parsed.scrollY === 'number' && parsed.scrollY > 0 ? parsed.scrollY : 0,
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function writeSongListUiState(state: SongListUiState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // private mode / quota — просто не сохраняем
  }
}

export function captureSongListScroll(artist: string | null, sort: SortMode): void {
  writeSongListUiState({
    artist,
    sort,
    scrollY: window.scrollY,
  })
}
