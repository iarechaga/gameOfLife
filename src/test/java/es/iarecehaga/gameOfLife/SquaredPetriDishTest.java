package es.iarecehaga.gameOfLife;

import es.iarecehaga.gameOfLife.cell.Cell;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;

public class SquaredPetriDishTest {

    private static final int DISH_SIZE = 100;

    private SquaredPetriDish squaredPetriDish = new SquaredPetriDish(DISH_SIZE);

    @Test
    public void shouldStoreCellBlock() {
        CellBlock cellBlock = new CellBlock(1, 2, new Cell());

        squaredPetriDish.add(cellBlock);

        assertThat(squaredPetriDish.cellStorage.size(), is(1));
    }

    @Test
    public void shouldBeAbleToRetrieveAnIncludedCell() {
        CellBlock cellBlock = new CellBlock(1, 2, new Cell());
        squaredPetriDish.add(cellBlock);

        CellBlock returnedCellBlock = squaredPetriDish.getCell(1, 2);

        assertThat(returnedCellBlock, is(cellBlock));
    }

    @Test
    public void shouldReturnEmptyCellBlock() {
        CellBlock returnedCellBlock = squaredPetriDish.getCell(1, 2);

        assertFalse(returnedCellBlock.containsCell());
    }

    @Test(expected = BlockOutOfLimitsException.class)
    public void shouldThrowExceptionWhenTryingToIncludeInWrongHorizontalPosition() {
        CellBlock cellBlock = new CellBlock(100, 2, new Cell());
        squaredPetriDish.add(cellBlock);
    }

    @Test(expected = BlockOutOfLimitsException.class)
    public void shouldThrowExceptionWhenTryingToIncludeInWrongVerticalPosition() {
        CellBlock cellBlock = new CellBlock(2, 100, new Cell());
        squaredPetriDish.add(cellBlock);
    }
}
