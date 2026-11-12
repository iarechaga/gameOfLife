import { CellBlock } from '../storage/CellBlock.ts';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';

export class EmptyBlockRetriever {
  public retrieve(occupiedCell: CellBlock, petriDish: SquaredPetriDish): CellBlock[] {
    return petriDish
      .getNeighbours(occupiedCell)
      .filter((cellBlock) => !cellBlock.containsCell());
  }
}
