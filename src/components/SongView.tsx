import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { formatChord } from '../lib/chords'
import { buildChordLyricSegments } from '../lib/chordLyricSegments'
import type { InlinePart, SongAst, SongBlock } from '../lib/chordproParse'
import {
  COLUMN_GAP_PX,
  maxLineWidthBudgetPx,
  packLyricColumns,
  type LyricColumnPack,
} from '../lib/packLyricColumns'
import { groupSongStanzas } from '../lib/songStanzas'
import { useMediaQuery } from '../hooks/useMediaQuery'
import ChordDiagramPanel from './ChordDiagramPanel'

type SongViewProps = {
  song: SongAst
}

function ChordLyricLine({ parts }: { parts: InlinePart[] }) {
  const hasChords = parts.some((part) => part.type === 'chord')

  if (!hasChords) {
    const text = parts.map((part) => (part.type === 'text' ? part.text : '')).join('')
    return <div className="lyric-line lyric-only">{text || '\u00a0'}</div>
  }

  const segments = buildChordLyricSegments(parts)
  const chordsOnly = segments.every(
    (segment) => !segment.lyric || /^\s*$/.test(segment.lyric),
  )

  return (
    <div
      className={
        chordsOnly ? 'chord-lyric-line chord-lyric-line--chords-only' : 'chord-lyric-line'
      }
    >
      {segments.map((segment, index) => (
        <span
          className="chord-lyric-seg"
          key={`${index}-${segment.chord ? formatChord(segment.chord) : ''}-${segment.lyric}-${segment.padAfter}`}
          style={
            segment.padAfter > 0
              ? { marginRight: `${segment.padAfter * 0.7}ch` }
              : undefined
          }
        >
          <span className="chord-name">
            {segment.chord ? formatChord(segment.chord) : '\u00a0'}
          </span>
          {!chordsOnly ? (
            <span className="lyric-text">{segment.lyric || '\u00a0'}</span>
          ) : null}
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

function StanzaView({ blocks }: { blocks: SongBlock[] }) {
  return (
    <div className="song-stanza">
      {blocks.map((block, blockIndex) => (
        <BlockView block={block} key={blockIndex} />
      ))}
    </div>
  )
}

function measureStanzaMetrics(
  root: HTMLElement,
  maxLineWidthPx: number,
): { heights: number[]; maxLineWidths: number[] } {
  const nodes = [...root.querySelectorAll<HTMLElement>(':scope > .song-stanza')]
  const heights: number[] = []
  const maxLineWidths: number[] = []

  for (const node of nodes) {
    const previousMaxWidth = node.style.maxWidth
    const previousWidth = node.style.width
    node.style.maxWidth = `${maxLineWidthPx}px`
    node.style.width = 'max-content'

    heights.push(node.getBoundingClientRect().height)

    let lineWidth = 0
    node
      .querySelectorAll<HTMLElement>(
        '.chord-lyric-line, .lyric-line, .song-section',
      )
      .forEach((line) => {
        lineWidth = Math.max(lineWidth, line.scrollWidth)
      })
    maxLineWidths.push(lineWidth)

    node.style.maxWidth = previousMaxWidth
    node.style.width = previousWidth
  }

  return { heights, maxLineWidths }
}

export default function SongView({ song }: SongViewProps) {
  const isDesktop = useMediaQuery('(min-width: 1100px)')
  const stanzas = useMemo(() => groupSongStanzas(song.blocks), [song.blocks])
  const measureRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [pack, setPack] = useState<LyricColumnPack | null>(null)

  useLayoutEffect(() => {
    if (!isDesktop) {
      setPack(null)
      return
    }

    const measureRoot = measureRef.current
    const board = boardRef.current
    if (!measureRoot || !board) return

    const update = () => {
      const availableWidthPx = board.clientWidth
      const availableHeightPx = Math.max(
        120,
        window.innerHeight - board.getBoundingClientRect().top - 12,
      )
      // Сначала оцениваем бюджет строки под 3 колонки — так высоты ближе к факту
      const maxLineWidthPx = maxLineWidthBudgetPx(
        window.innerWidth,
        3,
        availableWidthPx,
      )
      const { heights, maxLineWidths } = measureStanzaMetrics(
        measureRoot,
        maxLineWidthPx,
      )
      setPack(
        packLyricColumns(
          heights,
          maxLineWidths,
          availableHeightPx,
          maxLineWidthPx,
          { maxColumns: 3, availableWidthPx },
        ),
      )
    }

    update()

    const onResize = () => update()
    window.addEventListener('resize', onResize)

    const sizeObserver = new ResizeObserver(() => update())
    sizeObserver.observe(board)
    sizeObserver.observe(measureRoot)

    return () => {
      window.removeEventListener('resize', onResize)
      sizeObserver.disconnect()
    }
  }, [isDesktop, stanzas, song])

  if (!isDesktop) {
    return (
      <div className="song-layout">
        <div className="song-lyrics">
          {stanzas.map((stanza, index) => (
            <StanzaView blocks={stanza} key={index} />
          ))}
        </div>
        <ChordDiagramPanel song={song} variant="sidebar" />
      </div>
    )
  }

  const packedColumns = pack?.columns ?? [stanzas.map((_, index) => index)]
  const columnWidths = pack?.columnWidthsPx

  return (
    <div className="song-layout song-layout--desktop">
      <div
        className="song-lyrics-measure"
        ref={measureRef}
        aria-hidden="true"
      >
        {stanzas.map((stanza, index) => (
          <StanzaView blocks={stanza} key={index} />
        ))}
      </div>

      <div className="song-lyrics-board" ref={boardRef}>
        <div
          className={
            packedColumns.length === 1
              ? 'song-lyrics-columns song-lyrics-columns--single'
              : 'song-lyrics-columns'
          }
          style={
            {
              ['--song-col-gap' as string]: `${COLUMN_GAP_PX}px`,
              ['--song-col-count' as string]: String(packedColumns.length),
            } as CSSProperties
          }
        >
          {packedColumns.map((indexes, colIndex) => {
            const widthPx = columnWidths?.[colIndex] ?? 0
            const isLast = colIndex === packedColumns.length - 1
            const isFlex = isLast && packedColumns.length > 1

            return (
              <div
                className={
                  isFlex
                    ? 'song-lyrics-col song-lyrics-col--flex'
                    : 'song-lyrics-col song-lyrics-col--fixed'
                }
                key={colIndex}
                style={
                  !isFlex && widthPx > 0
                    ? { flexBasis: widthPx, width: widthPx, maxWidth: widthPx }
                    : undefined
                }
              >
                {indexes.map((stanzaIndex) => (
                  <StanzaView
                    blocks={stanzas[stanzaIndex]!}
                    key={`${colIndex}-${stanzaIndex}`}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <ChordDiagramPanel song={song} variant="sidebar" />
    </div>
  )
}
