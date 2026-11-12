import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Cell } from '../src/cell/Cell.ts';
import {
  EmptyBlockGenerationCalculator,
  EmptyBlockRetriever,
  NeighbourLivingCellsCounter,
  NextGenerationCalculator,
  OccupiedBlockGenerationCalculator,
} from '../src/generation/GenerationCalculators.ts';
import { EmptyBlockGameRules, LivingCellGameRules } from '../src/rules/GameRules.ts';
import { CellBlock } from '../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../src/storage/SquaredPetriDish.ts';

describe('NextGenerationCalculator immutable React evolution', () => {
  it('evolves Mini Exploder immutably without mutating previous dish snapshot', () => {
    const counter = new NeighbourLivingCellsCounter();
    const calculator = new NextGenerationCalculator(
      new OccupiedBlockGenerationCalculator(counter, new LivingCellGameRules()),
      new EmptyBlockGenerationCalculator(
        new EmptyBlockGameRules(),
        counter,
        new EmptyBlockRetriever(),
      ),
    );

    const initialDish = new SquaredPetriDish(10);
    [
      [2, 4],
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 3],
      [4, 5],
      [5, 4],
    ].forEach(([x, y]) => initialDish.add(new CellBlock(x!, y!, new Cell())));

    const nextDish = calculator.evolveImmutable(initialDish);

    // El snapshot anterior permanece intacto (inmutabilidad para React useState)
    assert.notEqual(nextDish, initialDish);
    assert.equal(initialDish.getOccupiedCells().length, 7);
    assert.equal(initialDish.getCell(3, 4).containsLivingCell(), true);

    // El nuevo snapshot contiene las 8 células de la iteración 1
    assert.equal(nextDish.getOccupiedCells().length, 8);
    assert.equal(nextDish.getCell(3, 4).containsLivingCell(), false);
    assert.equal(nextDish.getCell(2, 3).containsLivingCell(), true);
    assert.equal(nextDish.getCell(2, 5).containsLivingCell(), true);
  });
});
