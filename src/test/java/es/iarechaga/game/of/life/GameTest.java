package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import es.iarechaga.game.of.life.generation.NextGenerationCalculator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class GameTest {

    @Mock
    private SquaredPetriDish petriDish;
    @Mock
    private NextGenerationCalculator evolve;

    @InjectMocks
    private Game game;

    @Test
    public void shouldCalculateNextGenerationOfPetriDish() {
        game.nextGeneration();

        verify(evolve).evolve(petriDish);
    }
}
