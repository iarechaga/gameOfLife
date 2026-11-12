import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { EmptyBlockGenerationCalculator } from '../../src/generation/EmptyBlockGenerationCalculator.ts';
import { EmptyBlockRetriever } from '../../src/generation/EmptyBlockRetriever.ts';
import { NeighbourLivingCellsCounter } from '../../src/generation/NeighbourLivingCellsCounter.ts';
import { EmptyBlockGameRules } from '../../src/rules/EmptyBlockGameRules.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

describe('EmptyBlockGenerationCalculatorTest', () => {
  const DESIRED_X = 1;
  const DESIRED_Y = 2;

  it('shouldPopulateEmptyBlock', () => {
    const petriDish = new SquaredPetriDish(10);
    const gameRules = new EmptyBlockGameRules();
    const counter = new NeighbourLivingCellsCounter();
    const emptyBlockRetriever = new EmptyBlockRetriever();

    const emptyBlock = new CellBlock(DESIRED_X, DESIRED_Y);
    const occupiedCell = new CellBlock(DESIRED_X + 1, DESIRED_Y);
    const neighboursOfEmptyBlock: CellBlock[] = [];

    mock.method(petriDish, 'getOccupiedCells', () => [occupiedCell]);
    mock.method(emptyBlockRetriever, 'retrieve', () => [emptyBlock]);
    mock.method(petriDish, 'getNeighbours', () => neighboursOfEmptyBlock);
    mock.method(counter, 'count', () => 4);
    mock.method(gameRules, 'shouldPopulate', () => true);
    const addSpy = mock.method(petriDish, 'add');

    const generationCalculator = new EmptyBlockGenerationCalculator(
      gameRules,
      counter,
      emptyBlockRetriever,
    );
    generationCalculator.evolve(petriDish);

    const expectedAdded = new CellBlock(DESIRED_X, DESIRED_Y, new Cell());
    assert.equal(addSpy.mock.callCount(), 1);
    assert.equal(addSpy.mock.calls[0]?.arguments[0]?.equals(expectedAdded), true);
  });

  it('shouldNotPopulateEmptyBlock', () => {
    const petriDish = new SquaredPetriDish(10);
    const gameRules = new EmptyBlockGameRules();
    const counter = new NeighbourLivingCellsCounter();
    const emptyBlockRetriever = new EmptyBlockRetriever();

    const emptyBlock = new CellBlock(DESIRED_X, DESIRED_Y);
    const occupiedCell = new CellBlock(DESIRED_X + 1, DESIRED_Y);

    mock.method(petriDish, 'getOccupiedCells', () => [occupiedCell]);
    mock.method(emptyBlockRetriever, 'retrieve', () => [emptyBlock]);
    mock.method(petriDish, 'getNeighbours', () => []);
    mock.method(counter, 'count', () => 4);
    mock.method(gameRules, 'shouldPopulate', () => false);
    const addSpy = mock.method(petriDish, 'add');

    const generationCalculator = new EmptyBlockGenerationCalculator(
      gameRules,
      counter,
      emptyBlockRetriever,
    );
    generationCalculator.evolve(petriDish);

    assert.equal(addSpy.mock.callCount(), 0);
  });
});
