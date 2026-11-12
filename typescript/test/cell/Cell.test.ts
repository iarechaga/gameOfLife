import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Cell } from '../../src/cell/Cell.ts';
import { CellAlreadyKilledException } from '../../src/cell/CellAlreadyKilledException.ts';

describe('CellTest', () => {
  it('shouldBeAliveFromStart', () => {
    const cell = new Cell();

    assert.equal(cell.alive(), true);
  });

  it('shouldBeDeadAfterKillingCell', () => {
    const cell = new Cell();

    cell.die();

    assert.equal(cell.alive(), false);
  });

  it('cannotKillTwiceACell', () => {
    const cell = new Cell();

    cell.die();
    assert.throws(() => cell.die(), CellAlreadyKilledException);
  });
});
