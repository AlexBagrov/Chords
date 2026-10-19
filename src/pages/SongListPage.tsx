import { Link } from 'react-router'
import CapoBadge from '../components/CapoBadge'
import { songs } from '../lib/songCatalog'

export default function SongListPage() {
  return (
    <section>
      <h1>Список песен</h1>
      {songs.length === 0 ? (
        <p className="muted">В папке songs/ пока нет файлов .chordpro</p>
      ) : (
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song.id}>
              <Link to={`/songs/${song.id}`}>
                <span className="song-list-title">
                  {song.title}
                  {song.capo ? <CapoBadge fret={song.capo} className="capo-badge--inline" /> : null}
                </span>
                <span className="song-list-artist">{song.artist}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
