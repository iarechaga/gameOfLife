import { LivingCellBlockGenerator } from '../LivingCellBlockGenerator.ts';
import {
  EmptyBlockGenerationCalculator,
  EmptyBlockRetriever,
  NeighbourLivingCellsCounter,
  NextGenerationCalculator,
  OccupiedBlockGenerationCalculator,
} from '../generation/GenerationCalculators.ts';
import { EmptyBlockGameRules, LivingCellGameRules } from '../rules/GameRules.ts';

export const PETRI_DISH_SIZE = 20;

export interface GameDependencies {
  nextGenerationCalculator: NextGenerationCalculator;
  livingCellBlockGenerator: LivingCellBlockGenerator;
  defaultDishSize: number;
}

export function createDefaultDependencies(defaultDishSize = PETRI_DISH_SIZE): GameDependencies {
  const counter = new NeighbourLivingCellsCounter();
  const occupiedCalculator = new OccupiedBlockGenerationCalculator(
    counter,
    new LivingCellGameRules(),
  );
  const emptyCalculator = new EmptyBlockGenerationCalculator(
    new EmptyBlockGameRules(),
    counter,
    new EmptyBlockRetriever(),
  );

  return {
    nextGenerationCalculator: new NextGenerationCalculator(occupiedCalculator, emptyCalculator),
    livingCellBlockGenerator: new LivingCellBlockGenerator(),
    defaultDishSize,
  };
}
