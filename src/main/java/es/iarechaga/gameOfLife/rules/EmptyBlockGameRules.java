package es.iarechaga.gameOfLife.rules;

import javax.inject.Named;

@Named
public class EmptyBlockGameRules {

    private static final int MIN_AMOUNT_TO_REMAIN_EMPTY = 2;

    public boolean shouldPopulate(final int neighboursAmount) {
        return neighboursAmount > MIN_AMOUNT_TO_REMAIN_EMPTY;
    }
}
