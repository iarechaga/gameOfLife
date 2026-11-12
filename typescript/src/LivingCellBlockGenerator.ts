import { randomInt } from 'node:crypto';
import { Cell } from './cell/Cell.ts';
import { CellBlock } from './storage/CellBlock.ts';

export class LivingCellBlockGenerator {
  public smallExploder(range: number): CellBlock[] {
    const blocks: CellBlock[] = [];

    const randomRow = LivingCellBlockGenerator.getRandomInRange(1, Math.max(2, range - 2));
    const randomColumn = LivingCellBlockGenerator.getRandomInRange(1, Math.max(2, range - 1));

    blocks.push(new CellBlock(randomRow - 1, randomColumn, new Cell()));
    blocks.push(new CellBlock(randomRow, randomColumn - 1, new Cell()));
    blocks.push(new CellBlock(randomRow, randomColumn, new Cell()));
    blocks.push(new CellBlock(randomRow, randomColumn + 1, new Cell()));
    blocks.push(new CellBlock(randomRow + 1, randomColumn - 1, new Cell()));
    blocks.push(new CellBlock(randomRow + 1, randomColumn + 1, new Cell()));
    blocks.push(new CellBlock(randomRow + 2, randomColumn, new Cell()));

    return blocks;
  }

  private static getRandomInRange(minInclusive: number, maxExclusive: number): number {
    return randomInt(minInclusive, maxExclusive);
  }
}
