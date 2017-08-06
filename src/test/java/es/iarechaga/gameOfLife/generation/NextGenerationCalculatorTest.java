package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.storage.SquaredPetriDish;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class NextGenerationCalculatorTest {
    @Mock
    private OccupiedBlockGenerationCalculator occupiedBlockGenerationCalculator;
    @Mock
    private EmptyBlockGenerationCalculator emptyBlockGenerationCalculator;
    @InjectMocks
    private NextGenerationCalculator nextGenerationCalculator;

    @Test
    public void shouldEvolveFirstCellsAndThenEmptyBlocks() {
        SquaredPetriDish petriDish = new SquaredPetriDish(10);

        nextGenerationCalculator.evolve(petriDish);

        InOrder inOrder = inOrder(occupiedBlockGenerationCalculator, emptyBlockGenerationCalculator);
        inOrder.verify(occupiedBlockGenerationCalculator).evolve(petriDish);
        inOrder.verify(emptyBlockGenerationCalculator).evolve(petriDish);
    }

    @Test
    public void shouldRemoveDeadCells() {
        SquaredPetriDish petriDish = mock(SquaredPetriDish.class);

        nextGenerationCalculator.evolve(petriDish);

        verify(petriDish).cleanDeadCells();
    }
}
