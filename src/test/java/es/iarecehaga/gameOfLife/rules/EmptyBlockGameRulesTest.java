package es.iarecehaga.gameOfLife.rules;

import org.junit.Test;

import java.util.stream.IntStream;

import static org.junit.Assert.assertTrue;

public class EmptyBlockGameRulesTest {
    private EmptyBlockGameRules gameRules = new EmptyBlockGameRules();

    @Test
    public void shouldRemainEmptyWithFewNeighbours() {
        IntStream fewNeighbours = IntStream.range(0, 2);

        assertTrue(
                fewNeighbours.noneMatch(
                        neighboursAmount -> gameRules.shouldPopulate(neighboursAmount)
                )
        );
    }

    @Test
    public void shouldBecomePopulatedWithEnoughNeighbours() {
        IntStream fewNeighbours = IntStream.range(3, 9);

        assertTrue(
                fewNeighbours.allMatch(
                        neighboursAmount -> gameRules.shouldPopulate(neighboursAmount)
                )
        );
    }
}
