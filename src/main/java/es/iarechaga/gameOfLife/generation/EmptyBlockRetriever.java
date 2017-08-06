package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

import java.util.List;
import java.util.stream.Collectors;

public class EmptyBlockRetriever {
    public List<CellBlock> retrieve(final CellBlock occupiedCell, final SquaredPetriDish petriDish) {
        List<CellBlock> neighbours = petriDish.getNeighbours(occupiedCell);
        return neighbours.stream()
                         .filter(cellBlock -> !cellBlock.containsCell())
                         .collect(Collectors.toList());
    }
}
