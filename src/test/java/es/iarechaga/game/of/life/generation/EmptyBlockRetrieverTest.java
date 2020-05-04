package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.cell.Cell;
import es.iarechaga.game.of.life.storage.CellBlock;
import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class EmptyBlockRetrieverTest {

    private EmptyBlockRetriever retriever = new EmptyBlockRetriever();

    @Test
    public void shouldReturnAllEmptyBlocks() {
        final CellBlock occupiedCell = mock(CellBlock.class);
        final SquaredPetriDish petriDish = mock(SquaredPetriDish.class);
        int desiredEmptyBlocksAmount = 2;
        int numOfFilledBlocks = 5;
        when(petriDish.getNeighbours(occupiedCell)).thenReturn(blockList(desiredEmptyBlocksAmount, numOfFilledBlocks));

        List<CellBlock> surroundingEmptyBlocks = retriever.retrieve(occupiedCell, petriDish);

        assertThat(surroundingEmptyBlocks.size(), is(desiredEmptyBlocksAmount));
        assertTrue(surroundingEmptyBlocks.stream().noneMatch(CellBlock::containsCell));
    }

    @Test
    public void shouldReturnNoEmptyBlocks() {
        final CellBlock occupiedCell = mock(CellBlock.class);
        final SquaredPetriDish petriDish = mock(SquaredPetriDish.class);
        int desiredEmptyBlocksAmount = 0;
        int numOfFilledBlocks = 5;
        when(petriDish.getNeighbours(occupiedCell)).thenReturn(blockList(desiredEmptyBlocksAmount, numOfFilledBlocks));

        List<CellBlock> surroundingEmptyBlocks = retriever.retrieve(occupiedCell, petriDish);

        assertThat(surroundingEmptyBlocks.size(), is(desiredEmptyBlocksAmount));
        assertTrue(surroundingEmptyBlocks.stream().noneMatch(CellBlock::containsCell));
    }

    private List<CellBlock> blockList(int numOfEmptyBlocks, final int numOfFilledBlocks) {
        List<CellBlock> blocks = new ArrayList<>();
        IntStream emptyBlocksToGenerate = IntStream.range(0, numOfEmptyBlocks);
        emptyBlocksToGenerate.forEach(
                number -> blocks.add(new CellBlock(number, 1))
        );
        IntStream filledBlocksToGenerate = IntStream.range(0, numOfFilledBlocks);
        filledBlocksToGenerate.forEach(
                number -> blocks.add(new CellBlock(number, 1, new Cell()))
        );
        return blocks;
    }
}
