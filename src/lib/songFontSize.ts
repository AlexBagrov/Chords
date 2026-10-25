const STORAGE_KEY = 'chords:song-font-size'
export const DEFAULT_SONG_FONT_SIZE = 16
export const MIN_SONG_FONT_SIZE = 12
export const MAX_SONG_FONT_SIZE = 28

export function clampSongFontSize(value: number): number {
  return Math.min(MAX_SONG_FONT_SIZE, Math.max(MIN_SONG_FONT_SIZE, Math.round(value)))
}

export function readSongFontSize(): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw == null) return DEFAULT_SONG_FONT_SIZE
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return DEFAULT_SONG_FONT_SIZE
    return clampSongFontSize(parsed)
  } catch {
    return DEFAULT_SONG_FONT_SIZE
  }
}

export function writeSongFontSize(size: number): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(clampSongFontSize(size)))
  } catch {
    // private mode / quota
  }
}
