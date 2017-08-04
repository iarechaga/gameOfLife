package es.iarecehaga.gameOfLlife;

import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class CellTest {

    @Test
    public void shouldBeAliveFromStart() {
        Cell cell = new Cell();

        assertTrue(cell.alive());
    }

}
