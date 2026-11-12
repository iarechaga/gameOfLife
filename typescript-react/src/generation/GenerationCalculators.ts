import { Cell } from '../cell/Cell.ts';
import { EmptyBlockGameRules, LivingCellGameRules } from '../rules/GameRules.ts';
import { CellBlock } from '../storage/CellBlock.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';

export class NeighbourLivingCellsCounter {
  public count(cellList: CellBlock[]): number {
    return cellList.filter((cellBlock) => cellBlock.containsCell()).length;
  }
}

export class EmptyBlockRetriever {
  public retrieve(occupiedCell: CellBlock, petriDish: SquaredPetriDish): CellBlock[] {
    return petriDish
      .getNeighbours(occupiedCell)
      .filter((cellBlock) => !cellBlock.containsCell());
  }
}

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

export class EmptyBlockGenerationCalculator {
  private readonly gameRules: EmptyBlockGameRules;
  private readonly counter: NeighbourLivingCellsCounter;
  private readonly emptyBlockRetriever: EmptyBlockRetriever;

  constructor(
    gameRules: EmptyBlockGameRules,
    counter: NeighbourLivingCellsCounter,
    emptyBlockRetriever: EmptyBlockRetriever,
  ) {
    this.gameRules = gameRules;
    this.counter = counter;
    this.emptyBlockRetriever = emptyBlockRetriever;
  }

  public evolve(petriDish: SquaredPetriDish): void {
    const occupiedCells = petriDish.getOccupiedCells();
    const generatedCells: CellBlock[] = [];

    for (const occupiedCell of occupiedCells) {
      const emptyNeighbours = this.emptyBlockRetriever.retrieve(occupiedCell, petriDish);
      for (const emptyNeighbour of emptyNeighbours) {
        const livingCellsAround = this.counter.count(petriDish.getNeighbours(emptyNeighbour));
        if (this.gameRules.shouldPopulate(livingCellsAround)) {
          generatedCells.push(
            new CellBlock(emptyNeighbour.getX(), emptyNeighbour.getY(), new Cell()),
          );
        }
      }
    }

    generatedCells.forEach((cellBlock) => petriDish.add(cellBlock));
  }
}

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

  /**
   * Variante inmutable para React: clona el plato antes de evolucionar para producir una nueva referencia.
   */
  public evolveImmutable(petriDish: SquaredPetriDish): SquaredPetriDish {
    const nextDish = petriDish.clone();
    this.evolve(nextDish);
    return nextDish;
  }
}
