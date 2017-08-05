package es.iarecehaga.gameOfLlife;

import org.junit.Test;

import java.util.stream.IntStream;

import static org.junit.Assert.assertTrue;

public class GameRulesTest {
    private GameRules gameRules = new GameRules();;

    @Test
    public void shouldDieWithFewNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(0, 1);

        assertTrue(
                tooManyNeighboursOptions.allMatch(
                        neighbourAmount -> gameRules.shouldDie(neighbourAmount)
                )
        );
    }

    @Test
    public void shouldDieWithTooManyNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(4, 9);

        assertTrue(
                tooManyNeighboursOptions.allMatch(
                        neighbourAmount -> gameRules.shouldDie(neighbourAmount)
                )
        );
    }

    @Test
    public void cellSurvivesWithTwoOrThreeNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(2, 3);

        assertTrue(
                tooManyNeighboursOptions.noneMatch(
                        neighbourAmount -> gameRules.shouldDie(neighbourAmount)
                )
        );
    }

}
