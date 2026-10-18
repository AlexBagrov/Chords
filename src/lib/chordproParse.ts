import { parseChordproMeta } from './chordproMeta'
import {
  formatChord,
  parseChord,
  transposeChord,
  type Chord,
} from './chords'

export type InlinePart =
  | { type: 'chord'; chord: Chord }
  | { type: 'text'; text: string }

export type SongBlock =
  | { type: 'section'; name: string }
  | { type: 'line'; parts: InlinePart[] }
  | { type: 'empty' }

export type SongAst = {
  meta: {
    title: string
    artist: string
    key?: string
  }
  blocks: SongBlock[]
}

const DIRECTIVE_RE = /^\s*\{([a-zA-Z_#][^}]*)\}\s*$/
const INLINE_CHORD_RE = /\[([^\]]+)\]/g

function parseLineParts(line: string): InlinePart[] {
  const parts: InlinePart[] = []
  let lastIndex = 0

  for (const match of line.matchAll(INLINE_CHORD_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push({ type: 'text', text: line.slice(lastIndex, index) })
    }
    parts.push({ type: 'chord', chord: parseChord(match[1]) })
    lastIndex = index + match[0].length
  }

  if (lastIndex < line.length) {
    parts.push({ type: 'text', text: line.slice(lastIndex) })
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', text: line })
  }

  return parts
}

export function parseChordpro(source: string): SongAst {
  const meta = parseChordproMeta(source, 'Untitled')
  const blocks: SongBlock[] = []

  for (const rawLine of source.split(/\r?\n/)) {
    const trimmed = rawLine.trim()

    if (trimmed === '') {
      blocks.push({ type: 'empty' })
      continue
    }

    const directive = DIRECTIVE_RE.exec(trimmed)
    if (directive) {
      const body = directive[1].trim()
      if (body.startsWith('#')) {
        continue
      }

      const colon = body.indexOf(':')
      const key = (colon === -1 ? body : body.slice(0, colon)).trim().toLowerCase()
      const value = colon === -1 ? '' : body.slice(colon + 1).trim()

      if (key === 'title' || key === 'artist' || key === 'key') {
        continue
      }
      if (key === 'comment') {
        blocks.push({ type: 'section', name: value || 'Section' })
        continue
      }
      continue
    }

    blocks.push({ type: 'line', parts: parseLineParts(rawLine) })
  }

  while (blocks.length > 0 && blocks[0].type === 'empty') {
    blocks.shift()
  }
  while (blocks.length > 0 && blocks[blocks.length - 1].type === 'empty') {
    blocks.pop()
  }

  return { meta, blocks }
}

export function transposeSong(ast: SongAst, steps: number): SongAst {
  if (steps === 0) {
    return ast
  }

  return {
    meta: { ...ast.meta },
    blocks: ast.blocks.map((block) => {
      if (block.type !== 'line') {
        return block
      }
      return {
        type: 'line',
        parts: block.parts.map((part) => {
          if (part.type !== 'chord') {
            return part
          }
          return {
            type: 'chord',
            chord: transposeChord(part.chord, steps),
          }
        }),
      }
    }),
  }
}

export function formatInlineChord(chord: Chord): string {
  return formatChord(chord)
}
