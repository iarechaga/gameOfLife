import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { BlockOutOfLimitsException } from '../../src/storage/BlockOutOfLimitsException.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

describe('SquaredPetriDishTest', () => {
  const DISH_SIZE = 100;

  it('shouldStoreCellBlock', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(1, 2, new Cell());

    squaredPetriDish.add(cellBlock);

    assert.equal(squaredPetriDish.getOccupiedCells().length, 1);
  });

  it('shouldBeAbleToRetrieveAnIncludedCell', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(1, 2, new Cell());
    squaredPetriDish.add(cellBlock);

    const returnedCellBlock = squaredPetriDish.getCell(1, 2);

    assert.equal(returnedCellBlock.equals(cellBlock), true);
  });

  it('shouldReturnEmptyCellBlock', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const returnedCellBlock = squaredPetriDish.getCell(1, 2);

    assert.equal(returnedCellBlock.containsCell(), false);
  });

  it('shouldThrowExceptionWhenTryingToIncludeInWrongHorizontalPosition', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(101, 2, new Cell());

    assert.throws(() => squaredPetriDish.add(cellBlock), BlockOutOfLimitsException);
  });

  it('shouldThrowExceptionWhenTryingToIncludeInWrongNegativeHorizontalPosition', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(-101, 2, new Cell());

    assert.throws(() => squaredPetriDish.add(cellBlock), BlockOutOfLimitsException);
  });

  it('shouldThrowExceptionWhenTryingToIncludeInWrongVerticalPosition', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(2, 101, new Cell());

    assert.throws(() => squaredPetriDish.add(cellBlock), BlockOutOfLimitsException);
  });

  it('shouldThrowExceptionWhenTryingToIncludeInWrongNegativeVerticalPosition', () => {
    const squaredPetriDish = new SquaredPetriDish(DISH_SIZE);
    const cellBlock = new CellBlock(2, -101, new Cell());

    assert.throws(() => squaredPetriDish.add(cellBlock), BlockOutOfLimitsException);
  });

  it('shouldCleanDeadCells', () => {
    const petriDish = new SquaredPetriDish(10);
    const cellToBeKilled = new CellBlock(2, 2, new Cell());
    petriDish.add(cellToBeKilled);
    petriDish.add(new CellBlock(1, 2, new Cell()));
    petriDish.add(new CellBlock(1, 3, new Cell()));

    assert.equal(petriDish.getOccupiedCells().length, 3);

    cellToBeKilled.kill();
    assert.equal(petriDish.getOccupiedCells().length, 3);

    petriDish.cleanDeadCells();
    assert.equal(petriDish.getOccupiedCells().length, 2);
  });

  it('shouldReturnThreeNeighboursForCornerBlock', () => {
    const petriDish = new SquaredPetriDish(10);
    const targetBlock = new CellBlock(0, 0);

    const neighbours = petriDish.getNeighbours(targetBlock);

    assert.equal(neighbours.length, 3);
    assert.equal(neighbours.some((b) => b.equals(targetBlock)), false);
    assert.equal(neighbours.some((b) => b.equals(new CellBlock(0, 1))), true);
    assert.equal(neighbours.some((b) => b.equals(new CellBlock(1, 0))), true);
    assert.equal(neighbours.some((b) => b.equals(new CellBlock(1, 1))), true);
  });

  it('shouldReturnEightNeighboursForCenteredBlock', () => {
    const petriDish = new SquaredPetriDish(10);
    const targetBlock = new CellBlock(3, 3);

    const neighbours = petriDish.getNeighbours(targetBlock);

    assert.equal(neighbours.length, 8);
    assert.equal(neighbours.some((b) => b.equals(targetBlock)), false);
  });
});
