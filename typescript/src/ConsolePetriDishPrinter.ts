import { SquaredPetriDish } from './storage/SquaredPetriDish.ts';

export class ConsolePetriDishPrinter {
  private static readonly LIVING_CELL_SYMBOL = '▦';
  private static readonly EMPTY_CELL_SYMBOL = '□';

  public print(dish: SquaredPetriDish): void {
    const range = dish.getRange();

    for (let row = 0; row < range; row++) {
      let line = '';
      for (let column = 0; column < range; column++) {
        const cell = dish.getCell(row, column);
        line += cell.containsLivingCell()
          ? ConsolePetriDishPrinter.LIVING_CELL_SYMBOL
          : ConsolePetriDishPrinter.EMPTY_CELL_SYMBOL;
        line += ' ';
      }
      console.log(line);
    }
  }
}
