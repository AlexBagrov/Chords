---
name: ug-to-chordpro
description: >-
  Convert Ultimate Guitar (chords-above-lyrics) paste into ChordPro for this
  Chords PWA songbook. Use whenever the user pastes a UG tab, asks to add a song
  from UG, fix chord placement that drifted, or mentions UG→ChordPro / raw.ug.txt
  / расстановка аккордов. Always align chords by monospace column, never by
  approximate syllable guess.
---

# UG → ChordPro (Chords songbook)

## Hard rule: columns first

UG paste is **two lines**: chord line, then lyric line. Chord **start column**
maps to a place in the lyric. Do **not** place chords by “musical feel” or by
guessing word stress.

1. Treat paste as monospace. Count columns from 0 on both lines (leading spaces matter).
2. For each chord token on the chord line, take its start index.
3. Insert `[Chord]` in the lyric at that index (after snapping — see below).
4. Process insertions **right-to-left** so earlier indices stay valid.
5. Strip only the outer indent of the finished lyric line (`strip`), not internal spaces.

### Token snap (readability)

After taking the column, snap to the **start of the lyric token** under/near that
column so ChordPro does not split letters mid-word:

- Tokens break on whitespace and on `-–—,.;:!?«»"'()[]{}/`.
- If the column is on a space, advance to the next token.
- If mid-token, rewind to that token’s start.
- Hyphenated words (`Подожди-дожди-дожди`) are **separate tokens**.
- If a second chord snaps onto the **same** token, place it **after** that token (`[Dm]слово[E]`), not `[Dm][E]слово`.

Helper: `.cursor/skills/ug-to-chordpro/align_ug.py` (`ug_line_to_chordpro`).

Prefer running the helper on each chord/lyric pair when the paste is dense or
when the user complains about drift. Spot-check 2–3 lines by eye against the raw
columns.

## Notation normalizations (project)

Apply when writing ChordPro (note in `{# … }` source comment):

| UG | ChordPro |
|----|----------|
| `X+7` / `Xmaj7` | `Xmaj7` |
| `Xm3` (bass on third) | `Xm/<third>` e.g. `Am3`→`Am/C`, `A#m3`→`A#m/C#` |
| `X5+` / `X+` | `Xaug` / project `Xmaug` if already used |
| `X5-` / `Xm5-` | `Xb5` / `Xmb5` |
| `B (B7)` / `A or A7` | pick the dominant form (`B7`, `A7`) unless user says otherwise |
| `Hm` | `Bm` |
| Cyrillic `С#` | Latin `C#` |

**Do not** “fix” accidental quality unless the user says so (e.g. UG `F#` → `F`).

## Song file workflow

1. Save raw paste → `songs/raw/<id>.ug.txt` (header comment with title/artist).
2. Write `songs/<id>.chordpro`:
   - `{title}`, `{artist}`, `{key}` (+ `{capo: N}` if present)
   - Artist buckets already in use: named artists, `Movies/Cartoons`, `Разное Русское`
   - `Разное Русское`: title = `Исполнитель - Песня`
   - Movies: title = `Фильм - Песня` only if the user named the film
3. Sections: `{comment: Verse}`, `{comment: Chorus}`, `{comment: Intro}`, …
4. Instrumental bars: spaced chords `[C] [Am] [C] [Am]`, expand `}xN`.
5. Unmarked later verses: reuse the **same column pattern** from the marked verse (same relative placement), do not invent new harmony.
6. Skip UG chrome: `Аккорд Am`, «Свернуть», author riff essays unless useful as a short `{# … }` note.

## Anti-patterns

- Putting the next chord on the previous word because “it sounds better”.
- Dropping chords that sit past the end of the lyric — append them after the line.
- Collapsing `G/F#` to `G`.
- Leaving `Am3` / `C+7` unnormalized.
- Asking the user to reformat UG; convert what they pasted.

## Quick example

UG:

```text
Am     Am3       Dm     E
 Так и надо! - все говорят.
```

ChordPro:

```text
[Am]Так и [Am/C]надо! - [Dm]все [E]говорят.
```
