import { formatChord, type Chord } from '../lib/chords'
import type { InlinePart, SongAst, SongBlock } from '../lib/chordproParse'
import ChordDiagramPanel from './ChordDiagramPanel'

type SongViewProps = {
  song: SongAst
}

type Segment = {
  chord: Chord | null
  lyric: string
}

function ChordLyricLine({ parts }: { parts: InlinePart[] }) {
  const hasChords = parts.some((part) => part.type === 'chord')

  if (!hasChords) {
    const text = parts.map((part) => (part.type === 'text' ? part.text : '')).join('')
    return <div className="lyric-line lyric-only">{text || '\u00a0'}</div>
  }

  const segments: Segment[] = []
  let pendingChord: Chord | null = null

  for (const part of parts) {
    if (part.type === 'chord') {
      if (pendingChord) {
        segments.push({ chord: pendingChord, lyric: '' })
      }
      pendingChord = part.chord
      continue
    }

    if (pendingChord) {
      segments.push({ chord: pendingChord, lyric: part.text })
      pendingChord = null
    } else if (segments.length === 0) {
      segments.push({ chord: null, lyric: part.text })
    } else {
      segments[segments.length - 1].lyric += part.text
    }
  }

  if (pendingChord) {
    segments.push({ chord: pendingChord, lyric: '' })
  }

  return (
    <div className="chord-lyric-line">
      {segments.map((segment, index) => (
        <span
          className="chord-lyric-seg"
          key={`${index}-${segment.chord ? formatChord(segment.chord) : ''}-${segment.lyric}`}
        >
          <span className="chord-name">
            {segment.chord ? formatChord(segment.chord) : '\u00a0'}
          </span>
          <span className="lyric-text">{segment.lyric || '\u00a0'}</span>
        </span>
      ))}
    </div>
  )
}

function BlockView({ block }: { block: SongBlock }) {
  if (block.type === 'empty') {
    return <div className="song-empty-line" />
  }
  if (block.type === 'section') {
    return <h2 className="song-section">{block.name}</h2>
  }
  return <ChordLyricLine parts={block.parts} />
}

export default function SongView({ song }: SongViewProps) {
  return (
    <div className="song-layout">
      <div className="song-lyrics">
        {song.blocks.map((block, index) => (
          <BlockView block={block} key={index} />
        ))}
      </div>
      <ChordDiagramPanel song={song} />
    </div>
  )
}
