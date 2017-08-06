package es.iarechaga.gameOfLife.cell;

import es.iarechaga.gameOfLife.storage.InvalidUsageOfNullException;

class NullCell extends Cell {

    NullCell() {
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
