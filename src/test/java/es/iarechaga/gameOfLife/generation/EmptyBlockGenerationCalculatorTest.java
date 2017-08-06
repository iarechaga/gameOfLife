package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.cell.Cell;
import es.iarechaga.gameOfLife.rules.EmptyBlockGameRules;
import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class EmptyBlockGenerationCalculatorTest {

    public static final int DESIRED_X = 1;
    public static final int DESIRED_Y = 2;
    @Mock
    private EmptyBlockGameRules gameRules;
    @Mock
    private NeighbourLivingCellsCounter counter;
    @Mock
    private EmptyBlockRetriever emptyBlockRetriever;

    @InjectMocks
    private EmptyBlockGenerationCalculator generationCalculator;

    @Test
    public void shouldPopulateEmptyBlock() {
        final SquaredPetriDish petriDish = mock(SquaredPetriDish.class);
        final List<CellBlock> occupiedCells = new ArrayList<>();
        final List<CellBlock> emptyBlocks = new ArrayList<>();
        CellBlock emptyBlock = new CellBlock(DESIRED_X, DESIRED_Y);
        emptyBlocks.add(emptyBlock);
        CellBlock occupiedCell = new CellBlock(DESIRED_X + 1, DESIRED_Y);
        occupiedCells.add(occupiedCell);
        when(petriDish.getOccupiedCells()).thenReturn(occupiedCells);
        when(emptyBlockRetriever.retrieve(occupiedCell, petriDish)).thenReturn(emptyBlocks);
        final List<CellBlock> neighboursOfEmptyBlock = new ArrayList<>();
        when(petriDish.getNeighbours(emptyBlock)).thenReturn(neighboursOfEmptyBlock);
        final Integer someAmount = 4;
        when(counter.count(neighboursOfEmptyBlock)).thenReturn(someAmount);
        when(gameRules.shouldPopulate(someAmount)).thenReturn(Boolean.TRUE);

        generationCalculator.evolve(petriDish);

        verify(petriDish).add(eq(new CellBlock(DESIRED_X, DESIRED_Y, new Cell())));
    }

    @Test
    public void shouldNotPopulateEmptyBlock() {
        final SquaredPetriDish petriDish = mock(SquaredPetriDish.class);
        final List<CellBlock> occupiedCells = new ArrayList<>();
        final List<CellBlock> emptyBlocks = new ArrayList<>();
        CellBlock emptyBlock = new CellBlock(DESIRED_X, DESIRED_Y);
        emptyBlocks.add(emptyBlock);
        CellBlock occupiedCell = new CellBlock(DESIRED_X + 1, DESIRED_Y);
        occupiedCells.add(occupiedCell);
        when(petriDish.getOccupiedCells()).thenReturn(occupiedCells);
        when(emptyBlockRetriever.retrieve(occupiedCell, petriDish)).thenReturn(emptyBlocks);
        final List<CellBlock> neighboursOfEmptyBlock = new ArrayList<>();
        when(petriDish.getNeighbours(emptyBlock)).thenReturn(neighboursOfEmptyBlock);
        final Integer someAmount = 4;
        when(counter.count(neighboursOfEmptyBlock)).thenReturn(someAmount);
        when(gameRules.shouldPopulate(someAmount)).thenReturn(Boolean.FALSE);

        generationCalculator.evolve(petriDish);

        verify(petriDish, times(0)).add(any());
    }
}
