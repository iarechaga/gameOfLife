package es.iarechaga.gameOfLife.rules;

import javax.inject.Named;

@Named
public class EmptyBlockGameRules {

    private static final Integer NEEDED_CELLS_TO_POPULATE = 3;

    public boolean shouldPopulate(final int neighboursAmount) {
        return NEEDED_CELLS_TO_POPULATE.equals(neighboursAmount);
    }
}
