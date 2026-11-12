import { LivingCellGameRules } from '../rules/LivingCellGameRules.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';
import { NeighbourLivingCellsCounter } from './NeighbourLivingCellsCounter.ts';

export class OccupiedBlockGenerationCalculator {
  private readonly counter: NeighbourLivingCellsCounter;
  private readonly cellGameRules: LivingCellGameRules;

  constructor(counter: NeighbourLivingCellsCounter, cellGameRules: LivingCellGameRules) {
    this.counter = counter;
    this.cellGameRules = cellGameRules;
  }

  public evolve(petriDish: SquaredPetriDish): void {
    const livingCells = petriDish.getOccupiedCells();

    for (const cellBlock of livingCells) {
      const neighbours = petriDish.getNeighbours(cellBlock);
      const neighbourAmount = this.counter.count(neighbours);
      if (this.cellGameRules.shouldDie(neighbourAmount)) {
        cellBlock.kill();
      }
    }
  }
}
