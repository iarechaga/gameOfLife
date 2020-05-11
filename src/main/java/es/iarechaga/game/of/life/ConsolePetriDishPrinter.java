package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.storage.CellBlock;
import es.iarechaga.game.of.life.storage.SquaredPetriDish;

import javax.inject.Named;

@Named
public class ConsolePetriDishPrinter {

    private static final char LIVING_CELL_SYMBOL = '▦';
    private static final char EMPTY_CELL_SYMBOL = '□';

    public void print(SquaredPetriDish dish) {
        final Integer range = dish.getRange();

        for (int row = 0; row < range; row++) {
            for (int column = 0; column < range; column++) {
                final CellBlock cell = dish.getCell(row, column);
                if (cell.containsLivingCell()) {
                    System.out.print(LIVING_CELL_SYMBOL);
                } else {
                    System.out.print(EMPTY_CELL_SYMBOL);
                }
                System.out.print(' ');
            }
            System.out.println();
        }

    }
}
