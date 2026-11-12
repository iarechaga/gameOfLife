import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ApplicationConfiguration } from '../../src/ApplicationConfiguration.ts';
import { Cell } from '../../src/cell/Cell.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

function buildMiniExploder(): CellBlock[] {
  return [
    new CellBlock(2, 4, new Cell()),
    new CellBlock(3, 3, new Cell()),
    new CellBlock(3, 4, new Cell()),
    new CellBlock(3, 5, new Cell()),
    new CellBlock(4, 3, new Cell()),
    new CellBlock(4, 5, new Cell()),
    new CellBlock(5, 4, new Cell()),
  ];
}

function buildFirstMiniExploderIteration(): CellBlock[] {
  return [
    new CellBlock(2, 3, new Cell()),
    new CellBlock(2, 4, new Cell()),
    new CellBlock(2, 5, new Cell()),
    new CellBlock(3, 3, new Cell()),
    new CellBlock(3, 5, new Cell()),
    new CellBlock(4, 3, new Cell()),
    new CellBlock(4, 5, new Cell()),
    new CellBlock(5, 4, new Cell()),
  ];
}

describe('NextGenerationCalculatorIntegrationTest', () => {
  it('nextGenerationMiniExploder', () => {
    const { nextGenerationCalculator } = new ApplicationConfiguration().createContext();
    const petriDish = new SquaredPetriDish(10);

    buildMiniExploder().forEach((block) => petriDish.add(block));

    nextGenerationCalculator.evolve(petriDish);

    const occupied = petriDish.getOccupiedCells();
    const expected = buildFirstMiniExploderIteration();

    assert.equal(occupied.length, expected.length);
    for (const expectedBlock of expected) {
      assert.equal(
        occupied.some((actual) => actual.equals(expectedBlock)),
        true,
        `Expected block at (${expectedBlock.getX()}, ${expectedBlock.getY()})`,
      );
    }
  });
});
