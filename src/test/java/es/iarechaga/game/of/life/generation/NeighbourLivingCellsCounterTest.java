package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.cell.Cell;
import es.iarechaga.game.of.life.storage.CellBlock;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class NeighbourLivingCellsCounterTest {

    private NeighbourLivingCellsCounter counter = new NeighbourLivingCellsCounter();

    @Test
    public void shouldCountThreeLivingCells() {
        final List<CellBlock> cellBlocks = new ArrayList<>();
        cellBlocks.add(new CellBlock(1,2,new Cell()));
        cellBlocks.add(new CellBlock(1,2,new Cell()));
        cellBlocks.add(new CellBlock(1,2,new Cell()));
        cellBlocks.add(new CellBlock(1,2));
        cellBlocks.add(new CellBlock(1,2));
        cellBlocks.add(new CellBlock(1,2));

        Integer count = counter.count(cellBlocks);

        assertThat(count, is(3));
    }

    @Test
    public void shouldCountZeroLivingCells() {
        final List<CellBlock> cellBlocks = new ArrayList<>();
        cellBlocks.add(new CellBlock(1,2));
        cellBlocks.add(new CellBlock(1,2));
        cellBlocks.add(new CellBlock(1,2));

        Integer count = counter.count(cellBlocks);

        assertThat(count, is(0));
    }
}
