package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.rules.LivingCellGameRules;
import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class OccupiedBlockGenerationCalculatorTest {

    @Mock
    private SquaredPetriDish petriDish;

    @Mock
    private NeighbourLivingCellsCounter counter;
    @Mock
    private LivingCellGameRules cellGameRules;

    @InjectMocks
    private OccupiedBlockGenerationCalculator occupiedBlockGenerationCalculator;

    @Test
    public void shouldRetrieveCells() {
        occupiedBlockGenerationCalculator.evolve(petriDish);

        verify(petriDish).getOccupiedCells();
    }

    @Test
    public void shouldKillLivingCell() {
        final List<CellBlock> cellList = new ArrayList<>();
        CellBlock cellToDie = mock(CellBlock.class);
        cellList.add(cellToDie);
        when(petriDish.getOccupiedCells()).thenReturn(cellList);
        ArrayList<CellBlock> cellToDieNeighbours = new ArrayList<>();
        when(petriDish.getNeighbours(cellToDie)).thenReturn(cellToDieNeighbours);
        final Integer someAmount = 0;
        when(counter.count(cellToDieNeighbours)).thenReturn(someAmount);
        when(cellGameRules.shouldDie(someAmount)).thenReturn(Boolean.TRUE);

        occupiedBlockGenerationCalculator.evolve(petriDish);

        InOrder desiredSequence = inOrder(petriDish, counter, cellGameRules, cellToDie);
        desiredSequence.verify(petriDish).getOccupiedCells();
        desiredSequence.verify(petriDish).getNeighbours(cellToDie);
        desiredSequence.verify(counter).count(cellToDieNeighbours);
        desiredSequence.verify(cellGameRules).shouldDie(someAmount);
        desiredSequence.verify(cellToDie).kill();
        assertFalse(cellToDie.containsCell());
    }

    @Test
    public void shouldNotKillLivingCell() {
        final List<CellBlock> cellList = new ArrayList<>();
        CellBlock cellToLive = mock(CellBlock.class);
        cellList.add(cellToLive);
        when(petriDish.getOccupiedCells()).thenReturn(cellList);
        ArrayList<CellBlock> cellToDieNeighbours = new ArrayList<>();
        when(petriDish.getNeighbours(cellToLive)).thenReturn(cellToDieNeighbours);
        final Integer someAmount = 0;
        when(counter.count(cellToDieNeighbours)).thenReturn(someAmount);
        when(cellGameRules.shouldDie(someAmount)).thenReturn(Boolean.FALSE);

        occupiedBlockGenerationCalculator.evolve(petriDish);

        InOrder desiredSequence = inOrder(petriDish, counter, cellGameRules, cellToLive);
        desiredSequence.verify(petriDish).getOccupiedCells();
        desiredSequence.verify(petriDish).getNeighbours(cellToLive);
        desiredSequence.verify(counter).count(cellToDieNeighbours);
        desiredSequence.verify(cellGameRules).shouldDie(someAmount);
        desiredSequence.verifyNoMoreInteractions();
    }
}
