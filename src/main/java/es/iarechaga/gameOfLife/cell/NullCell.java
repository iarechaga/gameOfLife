package es.iarechaga.gameOfLife.cell;

import es.iarechaga.gameOfLife.storage.InvalidUsageOfNullException;

class NullCell extends Cell {

    NullCell() {
    }

    @Override
    public boolean alive() {
        throw new InvalidUsageOfNullException("Trying to check if a null cell is alive");
    }

    @Override
    public void die() {
        throw new InvalidUsageOfNullException("Trying to kill a null cell");
    }
}
