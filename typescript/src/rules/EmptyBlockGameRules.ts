export class EmptyBlockGameRules {
  private static readonly NEEDED_CELLS_TO_POPULATE = 3;

  public shouldPopulate(neighboursAmount: number): boolean {
    return EmptyBlockGameRules.NEEDED_CELLS_TO_POPULATE === neighboursAmount;
  }
}
