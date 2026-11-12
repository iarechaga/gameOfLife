import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { EmptyBlockGenerationCalculator } from '../../src/generation/EmptyBlockGenerationCalculator.ts';
import { EmptyBlockRetriever } from '../../src/generation/EmptyBlockRetriever.ts';
import { NeighbourLivingCellsCounter } from '../../src/generation/NeighbourLivingCellsCounter.ts';
import { NextGenerationCalculator } from '../../src/generation/NextGenerationCalculator.ts';
import { OccupiedBlockGenerationCalculator } from '../../src/generation/OccupiedBlockGenerationCalculator.ts';
import { EmptyBlockGameRules } from '../../src/rules/EmptyBlockGameRules.ts';
import { LivingCellGameRules } from '../../src/rules/LivingCellGameRules.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

describe('NextGenerationCalculatorTest', () => {
  it('shouldEvolveFirstCellsAndThenEmptyBlocks', () => {
    const sequence: string[] = [];
    const counter = new NeighbourLivingCellsCounter();
    const occupiedCalc = new OccupiedBlockGenerationCalculator(
      counter,
      new LivingCellGameRules(),
    );
    const emptyCalc = new EmptyBlockGenerationCalculator(
      new EmptyBlockGameRules(),
      counter,
      new EmptyBlockRetriever(),
    );
    const petriDish = new SquaredPetriDish(10);

    mock.method(occupiedCalc, 'evolve', () => {
      sequence.push('occupied');
    });
    mock.method(emptyCalc, 'evolve', () => {
      sequence.push('empty');
    });

    const nextGenerationCalculator = new NextGenerationCalculator(occupiedCalc, emptyCalc);
    nextGenerationCalculator.evolve(petriDish);

    assert.deepEqual(sequence, ['occupied', 'empty']);
  });

  it('shouldRemoveDeadCells', () => {
    const counter = new NeighbourLivingCellsCounter();
    const occupiedCalc = new OccupiedBlockGenerationCalculator(
      counter,
      new LivingCellGameRules(),
    );
    const emptyCalc = new EmptyBlockGenerationCalculator(
      new EmptyBlockGameRules(),
      counter,
      new EmptyBlockRetriever(),
    );
    const petriDish = new SquaredPetriDish(10);
    mock.method(occupiedCalc, 'evolve', () => {});
    mock.method(emptyCalc, 'evolve', () => {});
    const cleanSpy = mock.method(petriDish, 'cleanDeadCells', () => {});

    const nextGenerationCalculator = new NextGenerationCalculator(occupiedCalc, emptyCalc);
    nextGenerationCalculator.evolve(petriDish);

    assert.equal(cleanSpy.mock.callCount(), 1);
  });
});
