package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import es.iarechaga.game.of.life.generation.NextGenerationCalculator;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class Game {

    private final SquaredPetriDish petriDish;
    private final NextGenerationCalculator nextGenerationCalculator;

    @Inject
    public Game(final SquaredPetriDish petriDish, final NextGenerationCalculator nextGenerationCalculator) {
        this.petriDish = petriDish;
        this.nextGenerationCalculator = nextGenerationCalculator;
    }

    void nextGeneration() {
        nextGenerationCalculator.evolve(petriDish);
    }

    SquaredPetriDish getPetriDish() {
        return petriDish;
    }
}
