import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  createDefaultDependencies,
  PETRI_DISH_SIZE,
  type GameDependencies,
} from './createDefaultDependencies.ts';

export { createDefaultDependencies, PETRI_DISH_SIZE, type GameDependencies };

const GameDependenciesContext = createContext<GameDependencies | null>(null);

interface GameDependenciesProviderProps {
  children: ReactNode;
  dependencies?: GameDependencies;
}

/**
 * Equivalente en React al ApplicationConfiguration (@Configuration + @Bean) de Spring en Java.
 */
export function GameDependenciesProvider({
  children,
  dependencies,
}: GameDependenciesProviderProps) {
  const value = useMemo(
    () => dependencies ?? createDefaultDependencies(),
    [dependencies],
  );

  return (
    <GameDependenciesContext.Provider value={value}>
      {children}
    </GameDependenciesContext.Provider>
  );
}

export function useGameDependencies(): GameDependencies {
  const context = useContext(GameDependenciesContext);
  if (!context) {
    throw new Error('useGameDependencies must be used inside <GameDependenciesProvider>');
  }
  return context;
}
