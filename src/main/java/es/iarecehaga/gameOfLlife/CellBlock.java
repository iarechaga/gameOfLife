package es.iarecehaga.gameOfLlife;

import es.iarecehaga.gameOfLlife.cell.Cell;

public class CellBlock {

    private final Integer x;
    private final Integer y;
    private final Cell content;

    public CellBlock(final Integer x, final Integer y) {
        this.x = x;
        this.y = y;
        content = Cell.NULL;
    }

    public CellBlock(final Integer x, final Integer y, final Cell cell) {
        this.x = x;
        this.y = y;
        this.content = cell;
    }

    public Integer getX() {
        return x;
    }

    public Integer getY() {
        return y;
    }

    public boolean containsCell() {
        return !Cell.NULL.equals(content);
    }
}
