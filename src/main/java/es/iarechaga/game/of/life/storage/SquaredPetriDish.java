package es.iarechaga.game.of.life.storage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class SquaredPetriDish {
    private final Integer size;
    private final Map<Integer, Map<Integer, CellBlock>> cellStorage = new TreeMap<>();

    public SquaredPetriDish(final Integer size) {
        this.size = size;
    }

    public void add(final CellBlock cellBlock) {
        if (outOfBounds(cellBlock)) {
            throw new BlockOutOfLimitsException(String.format("Trying to access %d,%d with limit of %d", cellBlock.getX(), cellBlock.getY(), size));
        }
        Map<Integer, CellBlock> blocksRow = cellStorage.getOrDefault(cellBlock.getX(), new TreeMap<>());

        blocksRow.put(cellBlock.getY(), cellBlock);
        cellStorage.putIfAbsent(cellBlock.getX(), blocksRow);
    }

    public Integer getRange() {
        return size;
    }

    public CellBlock getCell(final int row, final int column) {
        return cellStorage.getOrDefault(row, new TreeMap<>())
                .getOrDefault(column, new CellBlock(row, column));
    }

    public void cleanDeadCells() {
        this.getOccupiedCells()
                .stream()
                .filter(cellBlock -> !cellBlock.containsLivingCell())
                .forEach(cell -> cellStorage.get(cell.getX()).remove(cell.getY()));
    }

    public List<CellBlock> getOccupiedCells() {
        return cellStorage.values()
                .stream()
                .flatMap(integerCellBlockMap -> integerCellBlockMap.values().stream())
                .filter(CellBlock::containsCell)
                .collect(Collectors.toList());
    }

    public List<CellBlock> getNeighbours(final CellBlock cellBlock) {
        Set<Integer> rows = calculateRangePossibilities(cellBlock.getX());
        Set<Integer> columns = calculateRangePossibilities(cellBlock.getY());
        List<CellBlock> neighbours = new ArrayList<>();
        rows.forEach(
                rowNumber -> columns
                        .forEach(
                                columnNumber -> neighbours.add(getCell(rowNumber, columnNumber))
                        )
        );
        neighbours.removeIf(element -> element.getX().equals(cellBlock.getX()) && element.getY().equals(cellBlock.getY()));
        return neighbours;
    }

    private Set<Integer> calculateRangePossibilities(final Integer index) {
        final int start = Math.max(index - 1, 0);
        final int finish = index + 1 >= size ? size : index + 1;
        return IntStream.range(start, finish + 1).boxed().collect(Collectors.toSet());
    }


    private boolean outOfBounds(final CellBlock cellBlock) {
        return outOfBounds(cellBlock.getX()) || outOfBounds(cellBlock.getY());
    }

    private boolean outOfBounds(final Integer position) {
        return position > size || position < 0;
    }
}
