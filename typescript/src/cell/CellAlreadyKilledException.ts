export class CellAlreadyKilledException extends Error {
  constructor(message = 'Cell has already been killed') {
    super(message);
    this.name = 'CellAlreadyKilledException';
  }
}
