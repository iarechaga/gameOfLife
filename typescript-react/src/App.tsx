import { useState } from 'react';
import { GuideView } from './academy/GuideView.tsx';
import { GameControls } from './components/GameControls.tsx';
import { PetriDishBoard } from './components/PetriDishBoard.tsx';
import { GameDependenciesProvider } from './context/GameDependenciesContext.tsx';
import { DojoView } from './dojo/DojoView.tsx';
import { useGame } from './hooks/useGame.ts';

type AppTab = 'game' | 'guide' | 'dojo';

function parseInitialTab(): { tab: AppTab; embed: boolean; kataId: string | null } {
  const params = new URLSearchParams(window.location.search);
  const rawView = params.get('view');
  const tab: AppTab =
    rawView === 'guide' || rawView === 'dojo' || rawView === 'game' ? rawView : 'dojo';
  return {
    tab,
    embed: params.get('embed') === '1',
    kataId: params.get('kata'),
  };
}

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
    <div className="app-shell">
      <div className="game-hero">
        <h2>Simulador React 19 — Dominio Inmutable + Context DI</h2>
        <p>Haz clic en cualquier celda para alternar su estado vivo/vacío.</p>
      </div>

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
    </div>
  );
}

export function App() {
  const initial = parseInitialTab();
  const [activeTab, setActiveTab] = useState<AppTab>(initial.tab);
  const [targetKataId, setTargetKataId] = useState<string | null>(initial.kataId);
  const [targetPhase, setTargetPhase] = useState<number>(1);

  const openKata = (kataId: string) => {
    setTargetKataId(kataId);
    setActiveTab('dojo');
  };

  const openPhase = (phaseNumber: number) => {
    setTargetPhase(phaseNumber);
    setActiveTab('guide');
  };

  return (
    <GameDependenciesProvider>
      <div className="platform-root">
        {!initial.embed && (
          <header className="platform-header">
            <div className="platform-header-inner">
              <div className="platform-brand">
                <span className="platform-badge">React 19 · TS 5.9</span>
                <div>
                  <h1>TypeScript + React · Academia &amp; Dojo para Senior Java</h1>
                  <p>
                    Guía paso a paso, juego inmutable y 6 katas con compilador TypeScript real en el
                    navegador
                  </p>
                </div>
              </div>

              <nav className="platform-nav" aria-label="Secciones">
                <button
                  type="button"
                  className={activeTab === 'dojo' ? 'active' : ''}
                  onClick={() => setActiveTab('dojo')}
                >
                  🥋 Dojo de Katas (6 en vivo)
                </button>
                <button
                  type="button"
                  className={activeTab === 'guide' ? 'active' : ''}
                  onClick={() => setActiveTab('guide')}
                >
                  📚 Guía Senior Java (10 Fases)
                </button>
                <button
                  type="button"
                  className={activeTab === 'game' ? 'active' : ''}
                  onClick={() => setActiveTab('game')}
                >
                  🎮 Tablero Game of Life
                </button>
              </nav>
            </div>
          </header>
        )}

        {initial.embed && (
          <div className="embed-subbar">
            <div className="embed-tabs">
              <button
                type="button"
                className={activeTab === 'guide' ? 'active' : ''}
                onClick={() => setActiveTab('guide')}
              >
                📚 Guía Paso a Paso (10 Fases)
              </button>
              <button
                type="button"
                className={activeTab === 'dojo' ? 'active' : ''}
                onClick={() => setActiveTab('dojo')}
              >
                🥋 Dojo Interactivo de Katas (TS + React en vivo)
              </button>
              <button
                type="button"
                className={activeTab === 'game' ? 'active' : ''}
                onClick={() => setActiveTab('game')}
              >
                🎮 App React Completa
              </button>
            </div>
            <a
              className="open-standalone-link"
              href={`./index.html?view=${activeTab}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir en pestaña dedicada ↗
            </a>
          </div>
        )}

        <main className="platform-main">
          {activeTab === 'game' && <GameScreen />}
          {activeTab === 'guide' && (
            <GuideView initialPhase={targetPhase} onOpenKata={openKata} />
          )}
          {activeTab === 'dojo' && (
            <DojoView initialKataId={targetKataId} onJumpToPhase={openPhase} />
          )}
        </main>
      </div>
    </GameDependenciesProvider>
  );
}
