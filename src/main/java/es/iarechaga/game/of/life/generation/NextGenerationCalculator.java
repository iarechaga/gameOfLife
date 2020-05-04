package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.storage.SquaredPetriDish;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class NextGenerationCalculator {

    private final OccupiedBlockGenerationCalculator occupiedBlockGenerationCalculator;
    private final EmptyBlockGenerationCalculator emptyBlockGenerationCalculator;

    @Inject
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
