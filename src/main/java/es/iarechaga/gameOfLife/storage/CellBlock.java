package es.iarechaga.gameOfLife.storage;

import es.iarechaga.gameOfLife.cell.Cell;

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

    public void kill() {
        content.die();
    }

    @Override
    public boolean equals(final Object obj) {
        if (!(obj instanceof CellBlock)) {
            return false;
        }
        CellBlock that = (CellBlock) obj;
        return this.getX().equals(that.getX())
               && this.getY().equals(that.getY())
               && this.containsCell() && that.containsCell();
    }
}
