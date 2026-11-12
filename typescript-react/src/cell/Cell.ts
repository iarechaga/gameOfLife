export class CellAlreadyKilledException extends Error {
  constructor(message = 'Cell has already been killed') {
    super(message);
    this.name = 'CellAlreadyKilledException';
  }
}

export class Cell {
  private isAlive = true;

  public alive(): boolean {
    return this.isAlive;
  }

  public die(): void {
    if (!this.alive()) {
      throw new CellAlreadyKilledException();
    }
    this.isAlive = false;
  }

  public equals(other: unknown): boolean {
    return this === other;
  }
}
