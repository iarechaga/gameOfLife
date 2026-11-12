package generation

import "gameoflife/storage"

type GenerationStep interface {
	Evolve(petriDish storage.PetriDish) error
}

type NextGenerationCalculator struct {
	occupiedBlockGenerationCalculator GenerationStep
	emptyBlockGenerationCalculator    GenerationStep
}

func NewNextGenerationCalculator(
	occupiedBlockGenerationCalculator GenerationStep,
	emptyBlockGenerationCalculator GenerationStep,
) *NextGenerationCalculator {
	return &NextGenerationCalculator{
		occupiedBlockGenerationCalculator: occupiedBlockGenerationCalculator,
		emptyBlockGenerationCalculator:    emptyBlockGenerationCalculator,
	}
}

func (c *NextGenerationCalculator) Evolve(petriDish storage.PetriDish) error {
	if err := c.occupiedBlockGenerationCalculator.Evolve(petriDish); err != nil {
		return err
	}
	if err := c.emptyBlockGenerationCalculator.Evolve(petriDish); err != nil {
		return err
	}
	petriDish.CleanDeadCells()
	return nil
}
