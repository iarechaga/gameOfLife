import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { ApplicationConfiguration } from '../src/ApplicationConfiguration.ts';
import { Game } from '../src/Game.ts';
import { SquaredPetriDish } from '../src/storage/SquaredPetriDish.ts';

describe('GameTest', () => {
  it('shouldCalculateNextGenerationOfPetriDish', () => {
    const { nextGenerationCalculator } = new ApplicationConfiguration().createContext();
    const petriDish = new SquaredPetriDish(10);
    const evolveSpy = mock.method(nextGenerationCalculator, 'evolve', () => {});
    const game = new Game(petriDish, nextGenerationCalculator);

    game.nextGeneration();

    assert.equal(evolveSpy.mock.callCount(), 1);
    assert.equal(evolveSpy.mock.calls[0]?.arguments[0], petriDish);
  });
});
