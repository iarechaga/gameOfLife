package es.iarechaga.game.of.life.rules;

import org.junit.Test;

import java.util.stream.IntStream;

import static org.junit.Assert.assertTrue;

public class EmptyBlockGameRulesTest {
    private EmptyBlockGameRules gameRules = new EmptyBlockGameRules();

    @Test
    public void shouldRemainEmptyWithFewNeighbours() {
        IntStream fewNeighbours = IntStream.range(0, 3);

        assertTrue(
                fewNeighbours.noneMatch(
                        neighboursAmount -> gameRules.shouldPopulate(neighboursAmount)
                )
        );
    }

    @Test
    public void shouldRemainEmptyWithTooManyNeighbours() {
        IntStream fewNeighbours = IntStream.range(4, 10);

        assertTrue(
                fewNeighbours.noneMatch(
                        neighboursAmount -> gameRules.shouldPopulate(neighboursAmount)
                )
        );
    }

    @Test
    public void shouldBecomePopulatedWithThreeNeighbours() {

        assertTrue(gameRules.shouldPopulate(3));
    }
}
