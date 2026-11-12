import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { EmptyBlockRetriever } from '../../src/generation/EmptyBlockRetriever.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { SquaredPetriDish } from '../../src/storage/SquaredPetriDish.ts';

function blockList(numOfEmptyBlocks: number, numOfFilledBlocks: number): CellBlock[] {
  const blocks: CellBlock[] = [];
  for (let i = 0; i < numOfEmptyBlocks; i++) {
    blocks.push(new CellBlock(i, 1));
  }
  for (let i = 0; i < numOfFilledBlocks; i++) {
    blocks.push(new CellBlock(i, 1, new Cell()));
  }
  return blocks;
}

describe('EmptyBlockRetrieverTest', () => {
  const retriever = new EmptyBlockRetriever();

  it('shouldReturnAllEmptyBlocks', () => {
    const occupiedCell = new CellBlock(0, 0, new Cell());
    const petriDish = new SquaredPetriDish(10);
    const desiredEmptyBlocksAmount = 2;
    const numOfFilledBlocks = 5;
    mock.method(petriDish, 'getNeighbours', () =>
      blockList(desiredEmptyBlocksAmount, numOfFilledBlocks),
    );

    const surroundingEmptyBlocks = retriever.retrieve(occupiedCell, petriDish);

    assert.equal(surroundingEmptyBlocks.length, desiredEmptyBlocksAmount);
    assert.equal(surroundingEmptyBlocks.every((b) => !b.containsCell()), true);
  });

  it('shouldReturnNoEmptyBlocks', () => {
    const occupiedCell = new CellBlock(0, 0, new Cell());
    const petriDish = new SquaredPetriDish(10);
    const desiredEmptyBlocksAmount = 0;
    const numOfFilledBlocks = 5;
    mock.method(petriDish, 'getNeighbours', () =>
      blockList(desiredEmptyBlocksAmount, numOfFilledBlocks),
    );

    const surroundingEmptyBlocks = retriever.retrieve(occupiedCell, petriDish);

    assert.equal(surroundingEmptyBlocks.length, desiredEmptyBlocksAmount);
    assert.equal(surroundingEmptyBlocks.every((b) => !b.containsCell()), true);
  });
});
