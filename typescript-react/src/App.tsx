import { GameControls } from './components/GameControls.tsx';
import { PetriDishBoard } from './components/PetriDishBoard.tsx';
import { GameDependenciesProvider } from './context/GameDependenciesContext.tsx';
import { useGame } from './hooks/useGame.ts';

function GameScreen() {
  const {
    petriDish,
    iteration,
    livingCount,
    isRunning,
    intervalMs,
    setIsRunning,
    setIntervalMs,
    nextGeneration,
    toggleCell,
    resetWithSmallExploder,
    clearDish,
  } = useGame();

  return (
    <main className="app-shell">
      <header>
        <h1>Game of Life — TypeScript + React</h1>
        <p>Haz clic en cualquier celda para alternar su estado vivo/vacío.</p>
      </header>

      <GameControls
        iteration={iteration}
        livingCount={livingCount}
        isRunning={isRunning}
        intervalMs={intervalMs}
        onTogglePlay={() => setIsRunning((running) => !running)}
        onNextGeneration={nextGeneration}
        onResetSmallExploder={resetWithSmallExploder}
        onClear={clearDish}
        onChangeInterval={setIntervalMs}
      />

      <PetriDishBoard dish={petriDish} onToggleCell={toggleCell} />
    </main>
  );
}

export function App() {
  return (
    <GameDependenciesProvider>
      <GameScreen />
    </GameDependenciesProvider>
  );
}
