import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import SongView from '../components/SongView'
import TransposeBar from '../components/TransposeBar'
import { transposeKeyLabel } from '../lib/chords'
import { parseChordpro, transposeSong } from '../lib/chordproParse'
import { getSongById } from '../lib/songCatalog'

export default function SongPage() {
  const { songId } = useParams()
  const song = songId ? getSongById(songId) : undefined
  const [steps, setSteps] = useState(0)

  useEffect(() => {
    setSteps(0)
  }, [songId])

  const baseAst = useMemo(
    () => (song ? parseChordpro(song.source) : null),
    [song],
  )

  const viewAst = useMemo(
    () => (baseAst ? transposeSong(baseAst, steps) : null),
    [baseAst, steps],
  )

  if (!song || !baseAst || !viewAst) {
    return (
      <section>
        <p>
          <Link to="/">← К списку</Link>
        </p>
        <h1>Песня не найдена</h1>
        <p className="muted">
          id: <code>{songId}</code>
        </p>
      </section>
    )
  }

  const originalKey = baseAst.meta.key
  const currentKey = transposeKeyLabel(originalKey, steps)

  return (
    <section className="song-page">
      <h1>{baseAst.meta.title}</h1>
      <p className="song-meta">{baseAst.meta.artist}</p>

      <div className="song-sticky-chrome">
        <p className="song-back">
          <Link to="/">← К списку</Link>
        </p>
        <TransposeBar
          steps={steps}
          originalKey={originalKey}
          currentKey={currentKey}
          capo={baseAst.meta.capo}
          onStepsChange={setSteps}
        />
      </div>

      <SongView song={viewAst} />
    </section>
  )
}
