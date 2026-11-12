import { useCallback, useEffect, useState } from 'react';
import { Cell } from '../cell/Cell.ts';
import { useGameDependencies } from '../context/GameDependenciesContext.tsx';
import { CellBlock } from '../storage/CellBlock.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';

const DEFAULT_INTERVAL_MS = 450;

/**
 * Custom Hook que sustituye a Game.java + GameRunner.java en arquitectura React.
 * Gestiona estado inmutable (useState) y el bucle temporal declarativo (useEffect).
 */
export function useGame() {
  const { nextGenerationCalculator, livingCellBlockGenerator, defaultDishSize } =
    useGameDependencies();

  const createSeededDish = useCallback(() => {
    const dish = new SquaredPetriDish(defaultDishSize);
    livingCellBlockGenerator
      .smallExploder(defaultDishSize)
      .forEach((block) => dish.add(block));
    return dish;
  }, [defaultDishSize, livingCellBlockGenerator]);

  const [petriDish, setPetriDish] = useState<SquaredPetriDish>(createSeededDish);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);

  const nextGeneration = useCallback(() => {
    setPetriDish((currentDish) => nextGenerationCalculator.evolveImmutable(currentDish));
    setIteration((current) => current + 1);
  }, [nextGenerationCalculator]);

  const toggleCell = useCallback((row: number, column: number) => {
    setPetriDish((currentDish) => {
      const nextDish = currentDish.clone();
      if (nextDish.getCell(row, column).containsLivingCell()) {
        nextDish.remove(row, column);
      } else {
        nextDish.add(new CellBlock(row, column, new Cell()));
      }
      return nextDish;
    });
  }, []);

  const resetWithSmallExploder = useCallback(() => {
    setIsRunning(false);
    setIteration(0);
    setPetriDish(createSeededDish());
  }, [createSeededDish]);

  const clearDish = useCallback(() => {
    setIsRunning(false);
    setIteration(0);
    setPetriDish(new SquaredPetriDish(defaultDishSize));
  }, [defaultDishSize]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const timerId = window.setInterval(nextGeneration, intervalMs);
    return () => window.clearInterval(timerId);
  }, [isRunning, intervalMs, nextGeneration]);

  return {
    petriDish,
    iteration,
    isRunning,
    intervalMs,
    livingCount: petriDish.getOccupiedCells().length,
    setIsRunning,
    setIntervalMs,
    nextGeneration,
    toggleCell,
    resetWithSmallExploder,
    clearDish,
  };
}
