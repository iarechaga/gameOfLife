package es.iarechaga.game.of.life.cell;

import es.iarechaga.game.of.life.storage.InvalidUsageOfNullException;

public class NullCell extends Cell {

    private static final NullCell NULL_CELL = new NullCell();

    public static Cell getInstance() {
        return NULL_CELL;
    }

    private NullCell() {
    }

    @Override
    public boolean alive() {
       return false;
    }

    @Override
    public void die() {
        throw new InvalidUsageOfNullException("Trying to kill a null cell");
    }

    @Override
    public boolean equals(Object o) {
        return this == o;
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
