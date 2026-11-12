import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { NeighbourLivingCellsCounter } from '../../src/generation/NeighbourLivingCellsCounter.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';

describe('NeighbourLivingCellsCounterTest', () => {
  const counter = new NeighbourLivingCellsCounter();

  it('shouldCountThreeLivingCells', () => {
    const cellBlocks: CellBlock[] = [
      new CellBlock(1, 2, new Cell()),
      new CellBlock(1, 2, new Cell()),
      new CellBlock(1, 2, new Cell()),
      new CellBlock(1, 2),
      new CellBlock(1, 2),
      new CellBlock(1, 2),
    ];

    const count = counter.count(cellBlocks);

    assert.equal(count, 3);
  });

  it('shouldCountZeroLivingCells', () => {
    const cellBlocks: CellBlock[] = [
      new CellBlock(1, 2),
      new CellBlock(1, 2),
      new CellBlock(1, 2),
    ];

    const count = counter.count(cellBlocks);

    assert.equal(count, 0);
  });
});
