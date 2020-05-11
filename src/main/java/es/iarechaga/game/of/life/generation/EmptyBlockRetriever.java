package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.storage.CellBlock;
import es.iarechaga.game.of.life.storage.SquaredPetriDish;

import javax.inject.Named;
import java.util.List;
import java.util.stream.Collectors;

@Named
public class EmptyBlockRetriever {
    public List<CellBlock> retrieve(final CellBlock occupiedCell, final SquaredPetriDish petriDish) {
        return petriDish.getNeighbours(occupiedCell).stream()
                .filter(cellBlock -> !cellBlock.containsCell())
                .collect(Collectors.toList());
    }
}
