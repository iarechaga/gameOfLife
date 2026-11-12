import { BlockOutOfLimitsException } from './BlockOutOfLimitsException.ts';
import { CellBlock } from './CellBlock.ts';

export class SquaredPetriDish {
  private readonly size: number;
  private readonly cellStorage = new Map<number, Map<number, CellBlock>>();

  constructor(size: number) {
    this.size = size;
  }

  public add(cellBlock: CellBlock): void {
    if (this.outOfBoundsBlock(cellBlock)) {
      throw new BlockOutOfLimitsException(
        `Trying to access ${cellBlock.getX()},${cellBlock.getY()} with limit of ${this.size}`,
      );
    }

    const blocksRow = this.cellStorage.get(cellBlock.getX()) ?? new Map<number, CellBlock>();
    blocksRow.set(cellBlock.getY(), cellBlock);
    if (!this.cellStorage.has(cellBlock.getX())) {
      this.cellStorage.set(cellBlock.getX(), blocksRow);
    }
  }

  public getRange(): number {
    return this.size;
  }

  public getCell(row: number, column: number): CellBlock {
    return this.cellStorage.get(row)?.get(column) ?? new CellBlock(row, column);
  }

  public cleanDeadCells(): void {
    this.getOccupiedCells()
      .filter((cellBlock) => !cellBlock.containsLivingCell())
      .forEach((cell) => {
        this.cellStorage.get(cell.getX())?.delete(cell.getY());
      });
  }

  public getOccupiedCells(): CellBlock[] {
    const sortedRows = [...this.cellStorage.keys()].sort((a, b) => a - b);
    const occupied: CellBlock[] = [];

    for (const row of sortedRows) {
      const rowMap = this.cellStorage.get(row)!;
      const sortedColumns = [...rowMap.keys()].sort((a, b) => a - b);
      for (const column of sortedColumns) {
        const block = rowMap.get(column)!;
        if (block.containsCell()) {
          occupied.push(block);
        }
      }
    }

    return occupied;
  }

  public getNeighbours(cellBlock: CellBlock): CellBlock[] {
    const rows = this.calculateRangePossibilities(cellBlock.getX());
    const columns = this.calculateRangePossibilities(cellBlock.getY());
    const neighbours: CellBlock[] = [];

    for (const rowNumber of rows) {
      for (const columnNumber of columns) {
        if (rowNumber !== cellBlock.getX() || columnNumber !== cellBlock.getY()) {
          neighbours.push(this.getCell(rowNumber, columnNumber));
        }
      }
    }

    return neighbours;
  }

  private calculateRangePossibilities(index: number): number[] {
    const start = Math.max(index - 1, 0);
    const finish = index + 1 >= this.size ? this.size : index + 1;
    const possibilities: number[] = [];
    for (let i = start; i <= finish; i++) {
      possibilities.push(i);
    }
    return possibilities;
  }

  private outOfBoundsBlock(cellBlock: CellBlock): boolean {
    return this.outOfBoundsPosition(cellBlock.getX()) || this.outOfBoundsPosition(cellBlock.getY());
  }

  private outOfBoundsPosition(position: number): boolean {
    return position > this.size || position < 0;
  }
}
