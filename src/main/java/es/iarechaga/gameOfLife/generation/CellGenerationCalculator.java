package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.rules.LivingCellGameRules;
import es.iarechaga.gameOfLife.storage.CellBlock;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

import java.util.List;

class CellGenerationCalculator {

    private final NeighbourCounter counter;
    private final LivingCellGameRules cellGameRules;

    public CellGenerationCalculator(final NeighbourCounter counter, final LivingCellGameRules cellGameRules) {
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
