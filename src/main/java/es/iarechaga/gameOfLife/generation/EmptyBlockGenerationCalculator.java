package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.cell.Cell;
import es.iarechaga.gameOfLife.rules.EmptyBlockGameRules;
import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

@Named
class EmptyBlockGenerationCalculator {

    private final EmptyBlockGameRules gameRules;
    private final NeighbourLivingCellsCounter counter;
    private final EmptyBlockRetriever emptyBlockRetriever;

    @Inject
    public EmptyBlockGenerationCalculator(final EmptyBlockGameRules gameRules, final NeighbourLivingCellsCounter counter,
                                          final EmptyBlockRetriever emptyBlockRetriever) {
        this.gameRules = gameRules;
        this.counter = counter;
        this.emptyBlockRetriever = emptyBlockRetriever;
    }

    public void evolve(final SquaredPetriDish petriDish) {
        List<CellBlock> occupiedCells = petriDish.getOccupiedCells();
        List<CellBlock> generatedCells = new ArrayList<>();
        for (final CellBlock occupiedCell : occupiedCells) {
            List<CellBlock> emptyNeighbours = emptyBlockRetriever.retrieve(occupiedCell, petriDish);
            for (CellBlock emptyNeighbour : emptyNeighbours) {
                Integer livingCellsAround = counter.count(petriDish.getNeighbours(emptyNeighbour));
                if (gameRules.shouldPopulate(livingCellsAround)) {
                    generatedCells.add(new CellBlock(emptyNeighbour.getX(), emptyNeighbour.getY(), new Cell()));
                }
            }
        }
        petriDish.addAll(generatedCells);
    }
}
