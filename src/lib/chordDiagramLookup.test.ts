import { describe, expect, it } from 'vitest'
import { formatChord, parseChord } from './chords'
import {
  chordToDbSuffix,
  lookupChordDiagram,
  qualityToSuffix,
} from './chordDiagramLookup'
import { parseChordpro } from './chordproParse'
import { collectUniqueChords } from './songChords'

describe('qualityToSuffix', () => {
  it('maps common qualities', () => {
    expect(qualityToSuffix('')).toBe('major')
    expect(qualityToSuffix('m')).toBe('minor')
    expect(qualityToSuffix('add9')).toBe('add9')
    expect(qualityToSuffix('7sus4')).toBe('7sus4')
    expect(qualityToSuffix('dim7')).toBe('dim7')
    expect(qualityToSuffix('sus')).toBe('sus4')
  })
})

describe('chordToDbSuffix', () => {
  it('uses real slash suffixes from chords-db', () => {
    expect(chordToDbSuffix(parseChord('G/F#'))).toBe('/F#')
    expect(chordToDbSuffix(parseChord('Am/G'))).toBe('m/G')
    expect(chordToDbSuffix(parseChord('G'))).toBe('major')
  })

  it('does not invent slash forms for complex qualities', () => {
    expect(chordToDbSuffix(parseChord('Cadd9/E'))).toBeUndefined()
  })
})

describe('lookupChordDiagram', () => {
  it('finds shapes used in Life Is Real', () => {
    for (const token of ['G', 'Em', 'D', 'C', 'Am', 'Bm', 'F', 'F#', 'Bb', 'Cadd9']) {
      const match = lookupChordDiagram(parseChord(token))
      expect(match, token).toBeTruthy()
      expect(match!.positions[0].frets).toHaveLength(6)
    }
  })

  it('looks up real G/F# fingering, not plain G', () => {
    const slash = lookupChordDiagram(parseChord('G/F#'))
    const plain = lookupChordDiagram(parseChord('G'))
    expect(slash).toBeTruthy()
    expect(slash!.suffix).toBe('/F#')
    expect(slash!.positions[0].frets).toEqual([2, 2, 0, 0, 0, 3])
    expect(slash!.positions[0].frets).not.toEqual(plain!.positions[0].frets)
  })

  it('keeps at most two variations (e.g. Cmaj7)', () => {
    const match = lookupChordDiagram(parseChord('Cmaj7'))
    expect(match).toBeTruthy()
    expect(match!.positions.length).toBe(2)
    expect(match!.positions[0].frets).toEqual([3, 3, 2, 0, 0, 0])
    expect(match!.positions[1].baseFret).toBe(3)
  })

  it('returns null for unknown quality', () => {
    expect(lookupChordDiagram(parseChord('Gxyz'))).toBeNull()
  })

  it('finds shapes from A Kind of Magic', () => {
    for (const token of ['A7', 'Cmaj7', 'Em7', 'D7', 'D11']) {
      const match = lookupChordDiagram(parseChord(token))
      expect(match, token).toBeTruthy()
    }
  })

  it('finds shapes after quality aliases / newly mapped suffixes', () => {
    for (const token of ['Gsus', 'Gsus4', 'D7sus4', 'E7sus4', 'Ebdim7']) {
      const match = lookupChordDiagram(parseChord(token))
      expect(match, token).toBeTruthy()
    }
    expect(lookupChordDiagram(parseChord('Gsus'))!.suffix).toBe('sus4')
  })

  it('uses local overrides when chords-db has no shape', () => {
    const missingFromDb = [
      'E/A',
      'D/C#',
      'D/G',
      'F#/A#',
      'D7/A',
      'D7/F#',
      'E7/G#',
      'Em7/G',
      'F#7/C#',
      'F#m7/E',
      'G7/B',
      'Edim/A#',
      'A5',
      'B5',
      'C5',
      'D5',
      'E5',
      'G5',
    ]
    for (const token of missingFromDb) {
      const match = lookupChordDiagram(parseChord(token))
      expect(match, token).toBeTruthy()
      expect(match!.suffix).toBe('override')
      expect(match!.positions[0].frets).toHaveLength(6)
    }
    // E/A — форма из таба Hammer to Fall (x06454 → base 4)
    expect(lookupChordDiagram(parseChord('E/A'))!.positions[0]).toMatchObject({
      frets: [-1, 0, 3, 1, 2, 1],
      baseFret: 4,
    })
  })

  it('every chord in songs/*.chordpro has a diagram', () => {
    const modules = import.meta.glob('../../songs/*.chordpro', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>

    const missing = new Set<string>()
    for (const source of Object.values(modules)) {
      const ast = parseChordpro(source)
      for (const chord of collectUniqueChords(ast, { diagramsOnly: true })) {
        if (!lookupChordDiagram(chord)) {
          missing.add(formatChord(chord))
        }
      }
    }
    expect([...missing].sort()).toEqual([])
  })
})
