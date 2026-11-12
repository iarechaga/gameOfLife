import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';
import { EmptyBlockGenerationCalculator } from './EmptyBlockGenerationCalculator.ts';
import { OccupiedBlockGenerationCalculator } from './OccupiedBlockGenerationCalculator.ts';

export class NextGenerationCalculator {
  private readonly occupiedBlockGenerationCalculator: OccupiedBlockGenerationCalculator;
  private readonly emptyBlockGenerationCalculator: EmptyBlockGenerationCalculator;

  constructor(
    occupiedBlockGenerationCalculator: OccupiedBlockGenerationCalculator,
    emptyBlockGenerationCalculator: EmptyBlockGenerationCalculator,
  ) {
    this.occupiedBlockGenerationCalculator = occupiedBlockGenerationCalculator;
    this.emptyBlockGenerationCalculator = emptyBlockGenerationCalculator;
  }

  public evolve(petriDish: SquaredPetriDish): void {
    this.occupiedBlockGenerationCalculator.evolve(petriDish);
    this.emptyBlockGenerationCalculator.evolve(petriDish);
    petriDish.cleanDeadCells();
  }
}
