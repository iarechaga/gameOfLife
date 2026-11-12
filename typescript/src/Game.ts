import { NextGenerationCalculator } from './generation/NextGenerationCalculator.ts';
import { SquaredPetriDish } from './storage/SquaredPetriDish.ts';

export class Game {
  private readonly petriDish: SquaredPetriDish;
  private readonly nextGenerationCalculator: NextGenerationCalculator;

  constructor(petriDish: SquaredPetriDish, nextGenerationCalculator: NextGenerationCalculator) {
    this.petriDish = petriDish;
    this.nextGenerationCalculator = nextGenerationCalculator;
  }

  public nextGeneration(): void {
    this.nextGenerationCalculator.evolve(this.petriDish);
  }

  public getPetriDish(): SquaredPetriDish {
    return this.petriDish;
  }
}
