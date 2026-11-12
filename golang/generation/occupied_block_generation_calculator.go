package generation

import (
	"gameoflife/rules"
	"gameoflife/storage"
)

type OccupiedBlockGenerationCalculator struct {
	counter       CellCounter
	cellGameRules rules.LivingRules
}

func NewOccupiedBlockGenerationCalculator(counter CellCounter, cellGameRules rules.LivingRules) *OccupiedBlockGenerationCalculator {
	return &OccupiedBlockGenerationCalculator{
		counter:       counter,
		cellGameRules: cellGameRules,
	}
}

func (c *OccupiedBlockGenerationCalculator) Evolve(petriDish storage.PetriDish) error {
	livingCells := petriDish.OccupiedCells()

	for _, cellBlock := range livingCells {
		neighbours := petriDish.Neighbours(cellBlock)
		neighbourAmount := c.counter.Count(neighbours)
		if c.cellGameRules.ShouldDie(neighbourAmount) {
			if err := cellBlock.Kill(); err != nil {
				return err
			}
		}
	}
	return nil
}
