package es.iarecehaga.gameOfLlife;

public class Cell {
    private boolean living = true;

    public boolean alive() {
        return living;
    }

    public void die() {
        living = false;
    }
}
