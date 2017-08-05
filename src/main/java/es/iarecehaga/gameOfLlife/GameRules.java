package es.iarecehaga.gameOfLlife;

public class GameRules {

    private static final int FEW_NEIGHBOURS_LIMIT = 2;
    private static final int TOO_MANY_NEIGHBOURS_LIMIT = 3;

    public boolean shouldDie(final Integer neighbours) {
        return neighbours < FEW_NEIGHBOURS_LIMIT
                || neighbours > TOO_MANY_NEIGHBOURS_LIMIT;
    }
}
