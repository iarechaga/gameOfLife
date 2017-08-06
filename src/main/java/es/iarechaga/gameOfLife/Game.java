package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.generation.NextGenerationCalculator;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

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

    public void nextGeneration() {
        nextGenerationCalculator.evolve(petriDish);
    }

    public SquaredPetriDish getPetriDish() {
        return petriDish;
    }
}
