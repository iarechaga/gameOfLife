import { CellBlock } from '../storage/CellBlock.ts';

export class NeighbourLivingCellsCounter {
  public count(cellList: CellBlock[]): number {
    return cellList.filter((cellBlock) => cellBlock.containsCell()).length;
  }
}
