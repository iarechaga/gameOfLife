package es.iarechaga.game.of.life.storage;

import es.iarechaga.game.of.life.cell.Cell;
import es.iarechaga.game.of.life.cell.NullCell;

import java.util.Objects;

public class CellBlock {

    private final Integer x;
    private final Integer y;
    private final Cell content;

    public CellBlock(final Integer x, final Integer y) {
        this.x = x;
        this.y = y;
        content = NullCell.getInstance();
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

    public Boolean containsCell() {
        return !NullCell.getInstance().equals(content);
    }

    public boolean containsLivingCell() {
        return containsCell() && content.alive();
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
               && this.containsCell().equals(that.containsCell());
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}
