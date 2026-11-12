export class LivingCellGameRules {
  private static readonly FEW_CELLS_LIMIT = 2;
  private static readonly TOO_MANY_CELLS = 3;

  public shouldDie(neighbours: number): boolean {
    return (
      neighbours < LivingCellGameRules.FEW_CELLS_LIMIT ||
      neighbours > LivingCellGameRules.TOO_MANY_CELLS
    );
  }
}
