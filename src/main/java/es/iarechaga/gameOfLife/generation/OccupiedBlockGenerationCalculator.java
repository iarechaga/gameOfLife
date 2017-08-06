package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.rules.LivingCellGameRules;
import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.List;

@Named
class OccupiedBlockGenerationCalculator {

    private final NeighbourLivingCellsCounter counter;
    private final LivingCellGameRules cellGameRules;

    @Inject
    public OccupiedBlockGenerationCalculator(final NeighbourLivingCellsCounter counter, final LivingCellGameRules cellGameRules) {
        this.counter = counter;
        this.cellGameRules = cellGameRules;
    }

    void evolve(final SquaredPetriDish petriDish) {
        List<CellBlock> livingCells = petriDish.getOccupiedCells();

        for (CellBlock cellBlock : livingCells) {
            final List<CellBlock> neighbours = petriDish.getNeighbours(cellBlock);
            Integer neighbourAmount = counter.count(neighbours);
            if (cellGameRules.shouldDie(neighbourAmount)) {
                cellBlock.kill();
            }
        }
    }
}
