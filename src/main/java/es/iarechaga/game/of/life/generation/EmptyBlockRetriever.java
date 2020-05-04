package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import es.iarechaga.game.of.life.storage.CellBlock;

import javax.inject.Named;
import java.util.List;
import java.util.stream.Collectors;

@Named
public class EmptyBlockRetriever {
    public List<CellBlock> retrieve(final CellBlock occupiedCell, final SquaredPetriDish petriDish) {
        List<CellBlock> neighbours = petriDish.getNeighbours(occupiedCell);
        return neighbours.stream()
                         .filter(cellBlock -> !cellBlock.containsCell())
                         .collect(Collectors.toList());
    }
}
