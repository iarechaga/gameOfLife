package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

import javax.inject.Named;

@Named
public class ConsolePetriDishPrinter {

    private static final String LIVING_CELL_SYMBOL = "▦";
    private static final String EMPTY_CELL_SYMBOL = "□";

    public void print(SquaredPetriDish dish) {
        Integer range = dish.getRange();

        for (int row = 0; row < range; row++) {
            for (int column = 0; column < range; column++) {
                CellBlock cell = dish.getCell(row, column);
                if (cell.containsLivingCell()) {
                    System.out.print(LIVING_CELL_SYMBOL);
                } else {
                    System.out.print(EMPTY_CELL_SYMBOL);
                }
                System.out.print(" ");
            }
            System.out.println();
        }

    }
}
