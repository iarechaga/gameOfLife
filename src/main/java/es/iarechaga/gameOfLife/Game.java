package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.generation.NextGenerationCalculator;
import es.iarechaga.gameOfLife.storage.SquaredPetriDish;

public class Game {

    private final SquaredPetriDish petriDish;
    private final NextGenerationCalculator nextGenerationCalculator;

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
