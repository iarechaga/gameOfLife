import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { CellBlock } from '../../src/storage/CellBlock.ts';
import { InvalidUsageOfNullException } from '../../src/storage/InvalidUsageOfNullException.ts';

describe('CellBlockTest', () => {
  const COORDINATE_X = 2;
  const COORDINATE_Y = 3;

  it('shouldNotContainCell', () => {
    const cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y);

    assert.equal(cellBlock.containsCell(), false);
  });

  it('shouldContainCell', () => {
    const cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y, new Cell());

    assert.equal(cellBlock.containsCell(), true);
  });

  it('shouldKeepGivenPositions', () => {
    const cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y, new Cell());

    assert.equal(cellBlock.getX(), COORDINATE_X);
    assert.equal(cellBlock.getY(), COORDINATE_Y);
  });

  it('cannotKillEmptyBlockCell', () => {
    const cellBlock = new CellBlock(0, 0);

    assert.throws(() => cellBlock.kill(), InvalidUsageOfNullException);
  });
});
