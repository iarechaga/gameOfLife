import { Cell } from './cell/Cell.ts';
import { CellBlock } from './storage/CellBlock.ts';

export class LivingCellBlockGenerator {
  public smallExploder(range: number): CellBlock[] {
    const randomRow = LivingCellBlockGenerator.getRandomInRange(1, Math.max(2, range - 2));
    const randomColumn = LivingCellBlockGenerator.getRandomInRange(1, Math.max(2, range - 1));

    return [
      new CellBlock(randomRow - 1, randomColumn, new Cell()),
      new CellBlock(randomRow, randomColumn - 1, new Cell()),
      new CellBlock(randomRow, randomColumn, new Cell()),
      new CellBlock(randomRow, randomColumn + 1, new Cell()),
      new CellBlock(randomRow + 1, randomColumn - 1, new Cell()),
      new CellBlock(randomRow + 1, randomColumn + 1, new Cell()),
      new CellBlock(randomRow + 2, randomColumn, new Cell()),
    ];
  }

  private static getRandomInRange(minInclusive: number, maxExclusive: number): number {
    const span = Math.max(1, maxExclusive - minInclusive);
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return minInclusive + (randomBuffer[0]! % span);
  }
}
