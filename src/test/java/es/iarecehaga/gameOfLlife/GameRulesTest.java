package es.iarecehaga.gameOfLlife;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class GameRulesTest {
    private GameRules gameRules = new GameRules();;

    @Test
    public void shouldDieWithFewNeighbours() {
        assertTrue(gameRules.shouldDie(0));
        assertTrue(gameRules.shouldDie(1));
    }

    @Test
    public void shouldDieWithTooManyNeighbours() {
        assertTrue(gameRules.shouldDie(4));
        assertTrue(gameRules.shouldDie(5));
        assertTrue(gameRules.shouldDie(6));
        assertTrue(gameRules.shouldDie(7));
        assertTrue(gameRules.shouldDie(8));
        assertTrue(gameRules.shouldDie(9));
    }

    @Test
    public void cellSurvivesWithTwoOrThreeNeighbours() {
        assertFalse(gameRules.shouldDie(2));
        assertFalse(gameRules.shouldDie(3));
    }

}
