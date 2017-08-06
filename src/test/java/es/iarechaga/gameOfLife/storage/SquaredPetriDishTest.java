package es.iarechaga.gameOfLife.storage;

import es.iarechaga.gameOfLife.cell.Cell;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class SquaredPetriDishTest {

    private static final int DISH_SIZE = 100;

    private SquaredPetriDish squaredPetriDish = new SquaredPetriDish(DISH_SIZE);

    @Test
    public void shouldStoreCellBlock() {
        CellBlock cellBlock = new CellBlock(1, 2, new Cell());

        squaredPetriDish.add(cellBlock);

        assertThat(squaredPetriDish.getOccupiedCells().size(), is(1));
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
        CellBlock cellBlock = new CellBlock(101, 2, new Cell());
        squaredPetriDish.add(cellBlock);
    }

    @Test(expected = BlockOutOfLimitsException.class)
    public void shouldThrowExceptionWhenTryingToIncludeInWrongNegativeHorizontalPosition() {
        CellBlock cellBlock = new CellBlock(-101, 2, new Cell());
        squaredPetriDish.add(cellBlock);
    }

    @Test(expected = BlockOutOfLimitsException.class)
    public void shouldThrowExceptionWhenTryingToIncludeInWrongVerticalPosition() {
        CellBlock cellBlock = new CellBlock(2, 101, new Cell());
        squaredPetriDish.add(cellBlock);
    }

    @Test(expected = BlockOutOfLimitsException.class)
    public void shouldThrowExceptionWhenTryingToIncludeInWrongNegativeVerticalPosition() {
        CellBlock cellBlock = new CellBlock(2, -101, new Cell());
        squaredPetriDish.add(cellBlock);
    }

    @Test
    public void shouldCleanDeadCells() {
        SquaredPetriDish petriDish = new SquaredPetriDish(10);
        int rowPositionToKill = 2;
        int columnPositionToKill = 2;
        CellBlock cellToBeKilled = new CellBlock(rowPositionToKill, columnPositionToKill, new Cell());
        petriDish.add(cellToBeKilled);
        petriDish.add(new CellBlock(1, 2, new Cell()));
        petriDish.add(new CellBlock(1, 3, new Cell()));

        assertThat(petriDish.getOccupiedCells().size(), is(3));

        cellToBeKilled.kill();

        assertThat(petriDish.getOccupiedCells().size(), is(3));

        petriDish.cleanDeadCells();

        assertThat(petriDish.getOccupiedCells().size(), is(2));
    }

    @Test
    public void shouldReturnThreeNeighboursForCornerBlock() {
        SquaredPetriDish petriDish = new SquaredPetriDish(10);
        CellBlock targetBlock = new CellBlock(0, 0);

        List<CellBlock> neighbours = petriDish.getNeighbours(targetBlock);

        assertThat(neighbours.size(), is(3));
        assertFalse(neighbours.contains(targetBlock));
        assertTrue(neighbours.contains(new CellBlock(0, 1)));
        assertTrue(neighbours.contains(new CellBlock(1, 0)));
        assertTrue(neighbours.contains(new CellBlock(1, 1)));
    }

    @Test
    public void shouldReturnEightNeighboursForCenteredBlock() {
        SquaredPetriDish petriDish = new SquaredPetriDish(10);
        CellBlock targetBlock = new CellBlock(3, 3);

        List<CellBlock> neighbours = petriDish.getNeighbours(targetBlock);

        assertThat(neighbours.size(), is(8));
        assertFalse(neighbours.contains(targetBlock));
    }
}
