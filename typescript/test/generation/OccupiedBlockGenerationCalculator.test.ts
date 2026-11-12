import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { NeighbourLivingCellsCounter } from '../../src/generation/NeighbourLivingCellsCounter.ts';
import { OccupiedBlockGenerationCalculator } from '../../src/generation/OccupiedBlockGenerationCalculator.ts';
import { LivingCellGameRules } from '../../src/rules/LivingCellGameRules.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

describe('OccupiedBlockGenerationCalculatorTest', () => {
  it('shouldRetrieveCells', () => {
    const petriDish = new SquaredPetriDish(10);
    const counter = new NeighbourLivingCellsCounter();
    const rules = new LivingCellGameRules();
    const calculator = new OccupiedBlockGenerationCalculator(counter, rules);
    const getOccupiedSpy = mock.method(petriDish, 'getOccupiedCells', () => []);

    calculator.evolve(petriDish);

    assert.equal(getOccupiedSpy.mock.callCount(), 1);
  });

  it('shouldKillLivingCell', () => {
    const sequence: string[] = [];
    const petriDish = new SquaredPetriDish(10);
    const counter = new NeighbourLivingCellsCounter();
    const rules = new LivingCellGameRules();
    const cellToDie = new CellBlock(1, 1, new Cell());
    const neighbours: CellBlock[] = [];

    mock.method(petriDish, 'getOccupiedCells', () => {
      sequence.push('getOccupiedCells');
      return [cellToDie];
    });
    mock.method(petriDish, 'getNeighbours', () => {
      sequence.push('getNeighbours');
      return neighbours;
    });
    mock.method(counter, 'count', () => {
      sequence.push('count');
      return 0;
    });
    mock.method(rules, 'shouldDie', () => {
      sequence.push('shouldDie');
      return true;
    });
    mock.method(cellToDie, 'kill', () => {
      sequence.push('kill');
    });

    const calculator = new OccupiedBlockGenerationCalculator(counter, rules);
    calculator.evolve(petriDish);

    assert.deepEqual(sequence, [
      'getOccupiedCells',
      'getNeighbours',
      'count',
      'shouldDie',
      'kill',
    ]);
  });

  it('shouldNotKillLivingCell', () => {
    const sequence: string[] = [];
    const petriDish = new SquaredPetriDish(10);
    const counter = new NeighbourLivingCellsCounter();
    const rules = new LivingCellGameRules();
    const cellToLive = new CellBlock(1, 1, new Cell());
    const neighbours: CellBlock[] = [];

    mock.method(petriDish, 'getOccupiedCells', () => {
      sequence.push('getOccupiedCells');
      return [cellToLive];
    });
    mock.method(petriDish, 'getNeighbours', () => {
      sequence.push('getNeighbours');
      return neighbours;
    });
    mock.method(counter, 'count', () => {
      sequence.push('count');
      return 2;
    });
    mock.method(rules, 'shouldDie', () => {
      sequence.push('shouldDie');
      return false;
    });
    const killSpy = mock.method(cellToLive, 'kill');

    const calculator = new OccupiedBlockGenerationCalculator(counter, rules);
    calculator.evolve(petriDish);

    assert.deepEqual(sequence, ['getOccupiedCells', 'getNeighbours', 'count', 'shouldDie']);
    assert.equal(killSpy.mock.callCount(), 0);
  });
});
