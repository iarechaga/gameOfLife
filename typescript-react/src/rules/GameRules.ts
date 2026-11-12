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

export class EmptyBlockGameRules {
  private static readonly NEEDED_CELLS_TO_POPULATE = 3;

  public shouldPopulate(neighboursAmount: number): boolean {
    return EmptyBlockGameRules.NEEDED_CELLS_TO_POPULATE === neighboursAmount;
  }
}
