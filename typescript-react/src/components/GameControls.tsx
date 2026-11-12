interface GameControlsProps {
  iteration: number;
  livingCount: number;
  isRunning: boolean;
  intervalMs: number;
  onTogglePlay: () => void;
  onNextGeneration: () => void;
  onResetSmallExploder: () => void;
  onClear: () => void;
  onChangeInterval: (ms: number) => void;
}

export function GameControls({
  iteration,
  livingCount,
  isRunning,
  intervalMs,
  onTogglePlay,
  onNextGeneration,
  onResetSmallExploder,
  onClear,
  onChangeInterval,
}: GameControlsProps) {
  return (
    <div className="controls-panel">
      <div className="metrics">
        <span>Generación: <strong>{iteration}</strong></span>
        <span>Células vivas: <strong>{livingCount}</strong></span>
      </div>

      <div className="actions">
        <button type="button" className="primary" onClick={onTogglePlay}>
          {isRunning ? 'Pausar' : 'Auto-evolucionar'}
        </button>
        <button type="button" onClick={onNextGeneration} disabled={isRunning}>
          Siguiente generación
        </button>
        <button type="button" onClick={onResetSmallExploder}>
          Nuevo Small Exploder
        </button>
        <button type="button" onClick={onClear}>
          Limpiar plato
        </button>
      </div>

      <label className="speed-control">
        Velocidad ({intervalMs} ms):
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={intervalMs}
          onChange={(e) => onChangeInterval(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
