import { Cell } from '../cell/Cell.ts';
import { NullCell } from '../cell/NullCell.ts';

export class CellBlock {
  private readonly x: number;
  private readonly y: number;
  private readonly content: Cell;

  constructor(x: number, y: number, cell: Cell = NullCell.getInstance()) {
    this.x = x;
    this.y = y;
    this.content = cell;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public containsCell(): boolean {
    return !NullCell.getInstance().equals(this.content);
  }

  public containsLivingCell(): boolean {
    return this.containsCell() && this.content.alive();
  }

  public kill(): void {
    this.content.die();
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof CellBlock)) {
      return false;
    }
    return (
      this.getX() === other.getX() &&
      this.getY() === other.getY() &&
      this.containsCell() === other.containsCell()
    );
  }
}
