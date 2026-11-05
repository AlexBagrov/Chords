"""UG chord-above-lyric → ChordPro inline. Column-aligned with token snap."""
from __future__ import annotations

import re
import sys
from collections import defaultdict


BOUNDARY_CHARS = set(" \t-–—,.;:!?\"'«»()[]{}/")


def is_boundary_before(ly: str, pos: int) -> bool:
    if pos <= 0 or pos >= len(ly):
        return True
    return ly[pos - 1] in BOUNDARY_CHARS


def snap_to_token(ly: str, pos: int) -> int:
    if pos >= len(ly):
        return len(ly)
    if pos < 0:
        return 0
    while pos < len(ly) and ly[pos].isspace():
        pos += 1
    if pos >= len(ly):
        return len(ly)
    while pos > 0 and not is_boundary_before(ly, pos):
        pos -= 1
    return pos


def token_end(ly: str, start: int) -> int:
    """End index (exclusive) of the token that starts at start."""
    pos = start
    while pos < len(ly) and ly[pos] not in BOUNDARY_CHARS:
        pos += 1
    return pos


def ug_line_to_chordpro(
    chord_line: str,
    lyric_line: str,
    replace: dict[str, str] | None = None,
) -> str:
    replace = replace or {}
    ch = chord_line.rstrip("\n")
    ly = lyric_line.rstrip("\n")
    events = [(m.start(), m.group()) for m in re.finditer(r"\S+", ch)]
    placed: list[tuple[int, str]] = []
    used_starts: set[int] = set()
    for pos, chord in events:
        chord = replace.get(chord, chord)
        start = snap_to_token(ly, pos)
        # Past end of lyric → append after line
        if start >= len(ly) or pos >= len(ly):
            placed.append((len(ly), chord))
            continue
        # Second+ chord that snapped onto the same word → put after that word
        if start in used_starts:
            placed.append((token_end(ly, start), chord))
        else:
            used_starts.add(start)
            placed.append((start, chord))
    by_pos: dict[int, list[str]] = defaultdict(list)
    for p, c in placed:
        by_pos[p].append(c)
    out = ly
    for pos in sorted(by_pos.keys(), reverse=True):
        chunk = "".join(f"[{c}]" for c in by_pos[pos])
        if pos >= len(out):
            out = out + chunk
        else:
            out = out[:pos] + chunk + out[pos:]
    return out.strip()


def convert_pairs(
    pairs: list[tuple[str, str]],
    replace: dict[str, str] | None = None,
) -> list[str]:
    return [ug_line_to_chordpro(c, l, replace) for c, l in pairs]


if __name__ == "__main__":
    # Demo / self-check for Дожди (Am fragment)
    rep = {"Am3": "Am/C", "C+7": "Cmaj7", "F#": "F"}
    pairs = [
        ("Am     Am3       Dm     E  ", " Так и надо! - все говорят."),
        ("  Am    Am3    Dm      E", " Так и надо - сам виноват."),
        (" Am     Dm7     G7", " Я про нее забывал,"),
        ("         C+7       F#", " И часто не замечал,"),
        ("        Dm7        E", " И, наконец, потерял."),
        ("      Am         Dm7", " Подожди-дожди-дожди!"),
        ("     G7                C7", " Я оставил любовь позади"),
        ("     F#            Dm", " И теперь у меня впереди"),
        ("    E7", " Дожди, дожди, дожди..."),
    ]
    for line in convert_pairs(pairs, rep):
        print(line)
