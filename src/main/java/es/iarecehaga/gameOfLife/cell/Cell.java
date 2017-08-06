package es.iarecehaga.gameOfLife.cell;

public class Cell {
    public static final Cell NULL = new NullCell();

    private boolean alive = true;

    public boolean alive() {
        return alive;
    }

    public void die() {
        if (!alive()) {
            throw new CellAlreadyKilledException();
        }
        alive = false;
    }
}
