package es.iarechaga.game.of.life.cell;

public class Cell {
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
