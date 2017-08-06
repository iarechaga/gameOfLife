package es.iarecehaga.gameOfLife;

import java.util.Map;
import java.util.TreeMap;

public class SquaredPetriDish {
    private final Integer size;
    Map<Integer, Map<Integer, CellBlock>> cellStorage = new TreeMap<>();

    public SquaredPetriDish(final Integer size) {
        this.size = size;
    }

    public void add(final CellBlock cellBlock) {
        if (outOfLimits(cellBlock)) {
            throw new BlockOutOfLimitsException(String.format("Trying to access %d,%d with limit of %d", cellBlock.getX(), cellBlock.getY(), size));
        }
        Map<Integer, CellBlock> blocksRow = cellStorage.getOrDefault(cellBlock.getX(), new TreeMap<>());

        blocksRow.put(cellBlock.getY(), cellBlock);
        cellStorage.putIfAbsent(cellBlock.getX(), blocksRow);
    }

    public CellBlock getCell(final int x, final int y) {
        return cellStorage.getOrDefault(x, new TreeMap<>())
                          .getOrDefault(y, new CellBlock(x, y));
    }

    private boolean outOfLimits(final CellBlock cellBlock) {
        return cellBlock.getX() >= size || cellBlock.getY() >= size;
    }
}
