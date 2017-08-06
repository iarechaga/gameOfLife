package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.storage.CellBlock;

import java.util.List;

public class NeighbourLivingCellsCounter {
    public Integer count(final List<CellBlock> cellList) {
        return (int) cellList.stream()
                             .filter(CellBlock::containsCell)
                             .count();
    }
}
