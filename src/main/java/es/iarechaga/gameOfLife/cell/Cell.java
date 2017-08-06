package es.iarechaga.gameOfLife.cell;

public class Cell {
    public static final Cell NULL = NullCell.getInstance();

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
