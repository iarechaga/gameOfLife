import { LivingCellBlockGenerator } from '../LivingCellBlockGenerator.ts';
import { Cell } from '../cell/Cell.ts';
import { NullCell } from '../cell/NullCell.ts';
import { createDefaultDependencies } from '../context/createDefaultDependencies.ts';
import {
  EmptyBlockGenerationCalculator,
  EmptyBlockRetriever,
  NeighbourLivingCellsCounter,
  NextGenerationCalculator,
  OccupiedBlockGenerationCalculator,
} from '../generation/GenerationCalculators.ts';
import { EmptyBlockGameRules, LivingCellGameRules } from '../rules/GameRules.ts';
import { BlockOutOfLimitsException } from '../storage/BlockOutOfLimitsException.ts';
import { CellBlock } from '../storage/CellBlock.ts';
import { InvalidUsageOfNullException } from '../storage/InvalidUsageOfNullException.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';

/**
 * Runtime bridge exposed as `import { ... } from './domain'` inside browser Katas.
 */
export const domainRuntimeModule = {
  Cell,
  NullCell,
  CellBlock,
  SquaredPetriDish,
  BlockOutOfLimitsException,
  InvalidUsageOfNullException,
  LivingCellGameRules,
  EmptyBlockGameRules,
  NeighbourLivingCellsCounter,
  EmptyBlockRetriever,
  OccupiedBlockGenerationCalculator,
  EmptyBlockGenerationCalculator,
  NextGenerationCalculator,
  LivingCellBlockGenerator,
  createDefaultDependencies,
};
