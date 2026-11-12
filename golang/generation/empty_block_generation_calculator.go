package generation

import (
	"gameoflife/cell"
	"gameoflife/rules"
	"gameoflife/storage"
)

type EmptyBlockGenerationCalculator struct {
	gameRules           rules.EmptyRules
	counter             CellCounter
	emptyBlockRetriever BlockRetriever
}

func NewEmptyBlockGenerationCalculator(
	gameRules rules.EmptyRules,
	counter CellCounter,
	emptyBlockRetriever BlockRetriever,
) *EmptyBlockGenerationCalculator {
	return &EmptyBlockGenerationCalculator{
		gameRules:           gameRules,
		counter:             counter,
		emptyBlockRetriever: emptyBlockRetriever,
	}
}

func (c *EmptyBlockGenerationCalculator) Evolve(petriDish storage.PetriDish) error {
	occupiedCells := petriDish.OccupiedCells()
	var generatedCells []*storage.CellBlock

	for _, occupiedCell := range occupiedCells {
		emptyNeighbours := c.emptyBlockRetriever.Retrieve(occupiedCell, petriDish)
		for _, emptyNeighbour := range emptyNeighbours {
			livingCellsAround := c.counter.Count(petriDish.Neighbours(emptyNeighbour))
			if c.gameRules.ShouldPopulate(livingCellsAround) {
				generatedCells = append(
					generatedCells,
					storage.NewCellBlock(emptyNeighbour.X(), emptyNeighbour.Y(), cell.NewCell()),
				)
			}
		}
	}

	for _, generated := range generatedCells {
		if err := petriDish.Add(generated); err != nil {
			return err
		}
	}
	return nil
}
