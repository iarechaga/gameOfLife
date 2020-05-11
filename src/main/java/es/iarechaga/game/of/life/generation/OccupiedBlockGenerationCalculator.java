package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.rules.LivingCellGameRules;
import es.iarechaga.game.of.life.storage.CellBlock;
import es.iarechaga.game.of.life.storage.SquaredPetriDish;

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
        final List<CellBlock> livingCells = petriDish.getOccupiedCells();

        for (final CellBlock cellBlock : livingCells) {
            final List<CellBlock> neighbours = petriDish.getNeighbours(cellBlock);
            final Integer neighbourAmount = counter.count(neighbours);
            if (cellGameRules.shouldDie(neighbourAmount)) {
                cellBlock.kill();
            }
        }
    }
}
