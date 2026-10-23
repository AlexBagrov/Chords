import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import CapoBadge from '../components/CapoBadge'
import { songs } from '../lib/songCatalog'
import { compareSongs, type SortMode } from '../lib/songListSort'
import {
  captureSongListScroll,
  readSongListUiState,
  writeSongListUiState,
} from '../lib/songListUiState'

function SortByArtistIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4.5 18.2c.4-2.6 2.3-4 4.5-4s4.1 1.4 4.5 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.2 7.2v7.6M13.8 12.2l2.4 2.6 2.4-2.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SortByTitleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5h7.2M4.5 12h5.2M4.5 17.5h3.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.2 5.8v12.4M13.8 15.4l2.4 2.6 2.4-2.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SortDefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M7.2 8.2A6.2 6.2 0 1 1 5.8 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M5.2 5.6v3.4h3.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SongListPage() {
  const initialUi = useMemo(() => readSongListUiState(), [])
  const artists = useMemo(() => {
    const unique = [...new Set(songs.map((song) => song.artist))]
    return unique.sort((a, b) => a.localeCompare(b, 'ru'))
  }, [])

  const [selectedArtist, setSelectedArtist] = useState<string | null>(() => {
    if (initialUi.artist && artists.includes(initialUi.artist)) {
      return initialUi.artist
    }
    return null
  })
  const [sortMode, setSortMode] = useState<SortMode>(initialUi.sort)
  const isDefaultView = selectedArtist === null && sortMode === 'artist'

  const visibleSongs = useMemo(() => {
    const filtered = selectedArtist
      ? songs.filter((song) => song.artist === selectedArtist)
      : songs

    return [...filtered].sort((a, b) => compareSongs(a, b, sortMode))
  }, [selectedArtist, sortMode])

  useLayoutEffect(() => {
    if (initialUi.scrollY > 0) {
      window.scrollTo(0, initialUi.scrollY)
    }
  }, [initialUi.scrollY])

  useEffect(() => {
    writeSongListUiState({
      artist: selectedArtist,
      sort: sortMode,
      scrollY: window.scrollY,
    })
  }, [selectedArtist, sortMode])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        writeSongListUiState({
          artist: selectedArtist,
          sort: sortMode,
          scrollY: window.scrollY,
        })
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [selectedArtist, sortMode])

  function persistAndResetScroll(nextArtist: string | null, nextSort: SortMode) {
    window.scrollTo(0, 0)
    writeSongListUiState({
      artist: nextArtist,
      sort: nextSort,
      scrollY: 0,
    })
  }

  function resetToDefault() {
    setSelectedArtist(null)
    setSortMode('artist')
    persistAndResetScroll(null, 'artist')
  }

  return (
    <section className="song-list-page">
      <div className="song-list-toolbar">
        <h1>Список песен</h1>
        {songs.length > 0 ? (
          <div className="song-sort" role="group" aria-label="Сортировка">
            <button
              type="button"
              className={sortMode === 'artist' ? 'is-active' : undefined}
              onClick={() => {
                setSortMode('artist')
                persistAndResetScroll(selectedArtist, 'artist')
              }}
              title="По исполнителю"
              aria-label="Сортировать по исполнителю"
              aria-pressed={sortMode === 'artist'}
            >
              <SortByArtistIcon />
            </button>
            <button
              type="button"
              className={sortMode === 'title' ? 'is-active' : undefined}
              onClick={() => {
                setSortMode('title')
                persistAndResetScroll(selectedArtist, 'title')
              }}
              title="По алфавиту"
              aria-label="Сортировать по алфавиту"
              aria-pressed={sortMode === 'title'}
            >
              <SortByTitleIcon />
            </button>
            <button
              type="button"
              onClick={resetToDefault}
              title="По умолчанию"
              aria-label="Сбросить к сортировке по умолчанию"
              disabled={isDefaultView}
            >
              <SortDefaultIcon />
            </button>
          </div>
        ) : null}
      </div>
      {songs.length === 0 ? (
        <p className="muted">В папке songs/ пока нет файлов .chordpro</p>
      ) : (
        <div className="song-list-layout">
          <aside className="artist-list" aria-label="Исполнители">
            <h2 className="artist-list-heading">Исполнители</h2>
            <ul>
              <li>
                <button
                  type="button"
                  className={selectedArtist === null ? 'is-active' : undefined}
                  onClick={() => {
                    setSelectedArtist(null)
                    persistAndResetScroll(null, sortMode)
                  }}
                >
                  Все
                </button>
              </li>
              {artists.map((artist) => (
                <li key={artist}>
                  <button
                    type="button"
                    className={selectedArtist === artist ? 'is-active' : undefined}
                    onClick={() => {
                      setSelectedArtist(artist)
                      persistAndResetScroll(artist, sortMode)
                    }}
                  >
                    {artist}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="song-list-panel">
            <h2 className="song-list-heading">
              {selectedArtist ?? 'Все песни'}
            </h2>
            {visibleSongs.length === 0 ? (
              <p className="muted">Песен этого исполнителя пока нет</p>
            ) : (
              <ul
                className={
                  selectedArtist ? 'song-list song-list--single-artist' : 'song-list'
                }
              >
                {visibleSongs.map((song, index) => {
                  const prev = visibleSongs[index - 1]
                  const artistBreak =
                    sortMode === 'artist' &&
                    !selectedArtist &&
                    prev !== undefined &&
                    prev.artist !== song.artist

                  return (
                    <li
                      key={song.id}
                      className={artistBreak ? 'song-list-item--artist-break' : undefined}
                    >
                      <Link
                        to={`/songs/${song.id}`}
                        onClick={() => captureSongListScroll(selectedArtist, sortMode)}
                      >
                        <span className="song-list-title">
                          {song.title}
                          {song.capo ? (
                            <CapoBadge fret={song.capo} className="capo-badge--inline" />
                          ) : null}
                        </span>
                        {!selectedArtist ? (
                          <span className="song-list-artist">{song.artist}</span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
