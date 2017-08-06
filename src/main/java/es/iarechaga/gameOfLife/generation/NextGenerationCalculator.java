package es.iarechaga.gameOfLife.generation;

import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

public class NextGenerationCalculator {

    private final OccupiedBlockGenerationCalculator occupiedBlockGenerationCalculator;
    private final EmptyBlockGenerationCalculator emptyBlockGenerationCalculator;

    public NextGenerationCalculator(final OccupiedBlockGenerationCalculator occupiedBlockGenerationCalculator,
                                    final EmptyBlockGenerationCalculator emptyBlockGenerationCalculator) {
        this.occupiedBlockGenerationCalculator = occupiedBlockGenerationCalculator;
        this.emptyBlockGenerationCalculator = emptyBlockGenerationCalculator;
    }

    public void evolve(final SquaredPetriDish petriDish) {
        occupiedBlockGenerationCalculator.evolve(petriDish);
        emptyBlockGenerationCalculator.evolve(petriDish);
        petriDish.cleanDeadCells();
    }
}
