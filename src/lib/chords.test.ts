import { describe, expect, it } from 'vitest'
import {
  formatChord,
  formatTransposeSteps,
  normalizeQuality,
  parseChord,
  stripChordSpaces,
  transposeChord,
  transposeKeyLabel,
} from './chords'

describe('parseChord', () => {
  it('parses simple and complex chords from Queen song', () => {
    expect(formatChord(parseChord('G'))).toBe('G')
    expect(formatChord(parseChord('Am'))).toBe('Am')
    expect(formatChord(parseChord('G/F#'))).toBe('G/F#')
    expect(formatChord(parseChord('Cadd9'))).toBe('Cadd9')
    expect(formatChord(parseChord('F#'))).toBe('F#')
    expect(formatChord(parseChord('Bb'))).toBe('Bb')
  })

  it('keeps unknown tokens as raw', () => {
    const chord = parseChord('N.C.')
    expect(chord.raw).toBe('N.C.')
    expect(formatChord(chord)).toBe('N.C.')
  })

  it('strips spaces and normalizes quality aliases', () => {
    expect(formatChord(parseChord('C add9'))).toBe('Cadd9')
    expect(formatChord(parseChord('G / B'))).toBe('G/B')
    expect(formatChord(parseChord('Gsus'))).toBe('Gsus4')
    expect(formatChord(parseChord('Amin'))).toBe('Am')
    expect(formatChord(parseChord('CM7'))).toBe('Cmaj7')
    expect(formatChord(parseChord('Gmaj'))).toBe('G')
  })
})

describe('normalizeQuality', () => {
  it('maps aliases to canon', () => {
    expect(normalizeQuality('sus')).toBe('sus4')
    expect(normalizeQuality('min')).toBe('m')
    expect(normalizeQuality('M7')).toBe('maj7')
    expect(normalizeQuality('maj')).toBe('')
    expect(stripChordSpaces('G / F#')).toBe('G/F#')
  })
})

describe('transposeChord', () => {
  it('shifts roots and keeps quality', () => {
    expect(formatChord(transposeChord(parseChord('G'), 2))).toBe('A')
    expect(formatChord(transposeChord(parseChord('Am'), 2))).toBe('Bm')
    expect(formatChord(transposeChord(parseChord('G/F#'), 2))).toBe('A/G#')
    expect(formatChord(transposeChord(parseChord('Cadd9'), 2))).toBe('Dadd9')
    expect(formatChord(transposeChord(parseChord('Bb'), 2))).toBe('C')
  })

  it('prefers flats when source used flats', () => {
    expect(formatChord(transposeChord(parseChord('Bb'), -1))).toBe('A')
    expect(formatChord(transposeChord(parseChord('Eb'), 1))).toBe('E')
    expect(formatChord(transposeChord(parseChord('Bb'), 1))).toBe('B')
    expect(formatChord(transposeChord(parseChord('Db'), 2))).toBe('Eb')
  })
})

describe('transposeKeyLabel', () => {
  it('shifts song key labels', () => {
    expect(transposeKeyLabel('G', 2)).toBe('A')
    expect(transposeKeyLabel('Am', 2)).toBe('Bm')
    expect(formatTransposeSteps(0)).toBe('0')
    expect(formatTransposeSteps(3)).toBe('+3')
    expect(formatTransposeSteps(-2)).toBe('-2')
  })
})
