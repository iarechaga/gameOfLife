package es.iarechaga.game.of.life.rules;

import javax.inject.Named;

@Named
public class LivingCellGameRules {

    private static final int FEW_CELLS_LIMIT = 2;
    private static final int TOO_MANY_CELLS = 3;

    public boolean shouldDie(final Integer neighbours) {
        return neighbours < FEW_CELLS_LIMIT
               || neighbours > TOO_MANY_CELLS;
    }

}
