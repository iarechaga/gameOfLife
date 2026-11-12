import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EmptyBlockGameRules } from '../../src/rules/EmptyBlockGameRules.ts';

describe('EmptyBlockGameRulesTest', () => {
  const gameRules = new EmptyBlockGameRules();

  it('shouldRemainEmptyWithFewNeighbours', () => {
    for (let n = 0; n < 3; n++) {
      assert.equal(gameRules.shouldPopulate(n), false);
    }
  });

  it('shouldRemainEmptyWithTooManyNeighbours', () => {
    for (let n = 4; n < 10; n++) {
      assert.equal(gameRules.shouldPopulate(n), false);
    }
  });

  it('shouldBecomePopulatedWithThreeNeighbours', () => {
    assert.equal(gameRules.shouldPopulate(3), true);
  });
});
