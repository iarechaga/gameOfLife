package es.iarechaga.gameOfLife.cell;

import es.iarechaga.gameOfLife.storage.InvalidUsageOfNullException;

class NullCell extends Cell {

    private static final NullCell NULL_CELL = new NullCell();

    static Cell getInstance() {
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
}
