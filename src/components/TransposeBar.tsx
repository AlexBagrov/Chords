import { formatTransposeSteps } from '../lib/chords'

type TransposeBarProps = {
  steps: number
  originalKey?: string
  currentKey?: string
  onStepsChange: (steps: number) => void
}

export default function TransposeBar({
  steps,
  originalKey,
  currentKey,
  onStepsChange,
}: TransposeBarProps) {
  return (
    <div className="transpose-bar" role="toolbar" aria-label="Транспонирование">
      <div className="transpose-controls">
        <button
          type="button"
          className="transpose-btn"
          aria-label="На полтона вниз"
          onClick={() => onStepsChange(steps - 1)}
        >
          −
        </button>
        <span className="transpose-steps" aria-live="polite">
          {formatTransposeSteps(steps)}
        </span>
        <button
          type="button"
          className="transpose-btn"
          aria-label="На полтона вверх"
          onClick={() => onStepsChange(steps + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="transpose-reset"
          disabled={steps === 0}
          onClick={() => onStepsChange(0)}
        >
          Сброс
        </button>
      </div>
      {currentKey ? (
        <p className="transpose-key">
          Тональность: <strong>{currentKey}</strong>
          {steps !== 0 && originalKey ? (
            <span className="muted"> (было {originalKey})</span>
          ) : null}
        </p>
      ) : (
        <p className="transpose-key muted">Сдвиг относительно исходных аккордов</p>
      )}
    </div>
  )
}
