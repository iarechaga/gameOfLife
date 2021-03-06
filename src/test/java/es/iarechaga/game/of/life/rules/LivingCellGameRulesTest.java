package es.iarechaga.game.of.life.rules;

import org.junit.Test;

import java.util.stream.IntStream;

import static org.junit.Assert.assertTrue;

public class LivingCellGameRulesTest {
    private LivingCellGameRules livingCellGameRules = new LivingCellGameRules();

    @Test
    public void shouldDieWithFewNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(0, 2);

        assertTrue(
                tooManyNeighboursOptions.allMatch(
                        neighbourAmount -> livingCellGameRules.shouldDie(neighbourAmount)
                )
        );
    }

    @Test
    public void shouldDieWithTooManyNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(4, 10);

        assertTrue(
                tooManyNeighboursOptions.allMatch(
                        neighbourAmount -> livingCellGameRules.shouldDie(neighbourAmount)
                )
        );
    }

    @Test
    public void cellSurvivesWithTwoOrThreeNeighbours() {
        IntStream tooManyNeighboursOptions = IntStream.range(2, 4);

        assertTrue(
                tooManyNeighboursOptions.noneMatch(
                        neighbourAmount -> livingCellGameRules.shouldDie(neighbourAmount)
                )
        );
    }

}
