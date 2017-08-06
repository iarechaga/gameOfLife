package es.iarechaga.gameOfLife.storage;

import es.iarechaga.gameOfLife.cell.Cell;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class CellBlockTest {

    private static final int COORDINATE_X = 2;
    private static final int COORDINATE_Y = 3;

    @Test
    public void shouldNotContainCell() {
        CellBlock cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y);

        assertFalse(cellBlock.containsCell());
    }

    @Test
    public void shouldContainCell() {
        CellBlock cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y, new Cell());

        assertTrue(cellBlock.containsCell());
    }

    @Test
    public void shouldKeepGivenPositions() {
        CellBlock cellBlock = new CellBlock(COORDINATE_X, COORDINATE_Y, new Cell());

        assertThat(cellBlock.getX(), is(COORDINATE_X));
        assertThat(cellBlock.getY(), is(COORDINATE_Y));
    }
}
