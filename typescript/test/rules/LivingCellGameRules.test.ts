import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LivingCellGameRules } from '../../src/rules/LivingCellGameRules.ts';

describe('LivingCellGameRulesTest', () => {
  const livingCellGameRules = new LivingCellGameRules();

  it('shouldDieWithFewNeighbours', () => {
    for (let n = 0; n < 2; n++) {
      assert.equal(livingCellGameRules.shouldDie(n), true);
    }
  });

  it('shouldDieWithTooManyNeighbours', () => {
    for (let n = 4; n < 10; n++) {
      assert.equal(livingCellGameRules.shouldDie(n), true);
    }
  });

  it('cellSurvivesWithTwoOrThreeNeighbours', () => {
    for (let n = 2; n < 4; n++) {
      assert.equal(livingCellGameRules.shouldDie(n), false);
    }
  });
});
