import { InvalidUsageOfNullException } from '../storage/InvalidUsageOfNullException.ts';
import { Cell } from './Cell.ts';

export class NullCell extends Cell {
  private static readonly NULL_CELL = new NullCell();

  public static getInstance(): Cell {
    return NullCell.NULL_CELL;
  }

  private constructor() {
    super();
  }

  public override alive(): boolean {
    return false;
  }

  public override die(): void {
    throw new InvalidUsageOfNullException('Trying to kill a null cell');
  }

  public override equals(other: unknown): boolean {
    return this === other;
  }
}
