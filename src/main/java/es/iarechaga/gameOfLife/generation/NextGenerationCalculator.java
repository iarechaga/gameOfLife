package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

public class NextGenerationCalculator {

    private final CellGenerationCalculator cellGenerationCalculator;
    private final EmptyBlockGenerationCalculator emptyBlockGenerationCalculator;

    public NextGenerationCalculator(final CellGenerationCalculator cellGenerationCalculator,
                                    final EmptyBlockGenerationCalculator emptyBlockGenerationCalculator) {
        this.cellGenerationCalculator = cellGenerationCalculator;
        this.emptyBlockGenerationCalculator = emptyBlockGenerationCalculator;
    }

    public void evolve(final SquaredPetriDish petriDish) {
        cellGenerationCalculator.evolve(petriDish);
        emptyBlockGenerationCalculator.evolve(petriDish);
        petriDish.cleanDeadCells();
    }
}
