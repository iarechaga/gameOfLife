package es.iarechaga.game.of.life.cell;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CellTest {

    @Test
    public void shouldBeAliveFromStart() {
        Cell cell = new Cell();

        assertTrue(cell.alive());
    }

    @Test
    public void shouldBeDeadAfterKillingCell() {
        Cell cell = new Cell();

        cell.die();

        assertFalse(cell.alive());
    }

    @Test(expected = CellAlreadyKilledException.class)
    public void cannotKillTwiceACell() {
        Cell cell = new Cell();

        cell.die();
        cell.die();
    }
}
