package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.storage.CellBlock;

import javax.inject.Named;
import java.util.List;

@Named
public class NeighbourLivingCellsCounter {
    public Integer count(final List<CellBlock> cellList) {
        return (int) cellList.stream()
                             .filter(CellBlock::containsCell)
                             .count();
    }
}
