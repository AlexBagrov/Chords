import {
  DEFAULT_SONG_FONT_SIZE,
  MAX_SONG_FONT_SIZE,
  MIN_SONG_FONT_SIZE,
} from '../lib/songFontSize'

type FontSizeBarProps = {
  size: number
  onSizeChange: (size: number) => void
}

export default function FontSizeBar({ size, onSizeChange }: FontSizeBarProps) {
  return (
    <div className="font-size-bar" role="toolbar" aria-label="Размер шрифта">
      <div className="font-size-controls">
        <span className="font-size-label" aria-hidden="true">
          A
        </span>
        <button
          type="button"
          className="transpose-btn"
          aria-label="Уменьшить шрифт"
          disabled={size <= MIN_SONG_FONT_SIZE}
          onClick={() => onSizeChange(size - 1)}
        >
          −
        </button>
        <span className="transpose-steps" aria-live="polite">
          {size}
        </span>
        <button
          type="button"
          className="transpose-btn"
          aria-label="Увеличить шрифт"
          disabled={size >= MAX_SONG_FONT_SIZE}
          onClick={() => onSizeChange(size + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="transpose-reset"
          disabled={size === DEFAULT_SONG_FONT_SIZE}
          onClick={() => onSizeChange(DEFAULT_SONG_FONT_SIZE)}
        >
          Сброс
        </button>
      </div>
      <p className="font-size-key">Размер шрифта</p>
    </div>
  )
}
