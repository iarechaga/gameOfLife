import { Cell } from '../cell/Cell.ts';
import { EmptyBlockGameRules } from '../rules/EmptyBlockGameRules.ts';
import { CellBlock } from '../storage/CellBlock.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';
import { EmptyBlockRetriever } from './EmptyBlockRetriever.ts';
import { NeighbourLivingCellsCounter } from './NeighbourLivingCellsCounter.ts';

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
