package game_test

import (
	"gameoflife/cell"
	"gameoflife/game"
	"gameoflife/storage"
	"testing"
)

type spyEvolutionCalculator struct {
	calledWith storage.PetriDish
	callCount  int
}

func (s *spyEvolutionCalculator) Evolve(petriDish storage.PetriDish) error {
	s.callCount++
	s.calledWith = petriDish
	return nil
}

func TestShouldCalculateNextGenerationOfPetriDish(t *testing.T) {
	dish := storage.NewSquaredPetriDish(10)
	spyCalc := &spyEvolutionCalculator{}
	g := game.NewGame(dish, spyCalc)

	if err := g.NextGeneration(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if spyCalc.callCount != 1 {
		t.Fatalf("expected Evolve to be called once, got %d", spyCalc.callCount)
	}
	if spyCalc.calledWith != dish {
		t.Fatal("expected Evolve to be called with the game's petri dish")
	}
}

func TestNextGenerationMiniExploderIntegration(t *testing.T) {
	ctx := game.NewApplicationConfiguration().CreateContext(10)
	petriDish := storage.NewSquaredPetriDish(10)

	for _, block := range buildMiniExploder() {
		if err := petriDish.Add(block); err != nil {
			t.Fatalf("unexpected error adding block: %v", err)
		}
	}

	if err := ctx.NextGenerationCalculator.Evolve(petriDish); err != nil {
		t.Fatalf("unexpected error evolving: %v", err)
	}

	occupied := petriDish.OccupiedCells()
	expected := buildFirstMiniExploderIteration()

	if len(occupied) != len(expected) {
		t.Fatalf("expected %d occupied cells, got %d", len(expected), len(occupied))
	}

	for _, exp := range expected {
		found := false
		for _, actual := range occupied {
			if actual.Equals(exp) {
				found = true
				break
			}
		}
		if !found {
			t.Fatalf("expected living cell at (%d,%d)", exp.X(), exp.Y())
		}
	}
}

func buildMiniExploder() []*storage.CellBlock {
	return []*storage.CellBlock{
		storage.NewCellBlock(2, 4, cell.NewCell()),
		storage.NewCellBlock(3, 3, cell.NewCell()),
		storage.NewCellBlock(3, 4, cell.NewCell()),
		storage.NewCellBlock(3, 5, cell.NewCell()),
		storage.NewCellBlock(4, 3, cell.NewCell()),
		storage.NewCellBlock(4, 5, cell.NewCell()),
		storage.NewCellBlock(5, 4, cell.NewCell()),
	}
}

func buildFirstMiniExploderIteration() []*storage.CellBlock {
	return []*storage.CellBlock{
		storage.NewCellBlock(2, 3, cell.NewCell()),
		storage.NewCellBlock(2, 4, cell.NewCell()),
		storage.NewCellBlock(2, 5, cell.NewCell()),
		storage.NewCellBlock(3, 3, cell.NewCell()),
		storage.NewCellBlock(3, 5, cell.NewCell()),
		storage.NewCellBlock(4, 3, cell.NewCell()),
		storage.NewCellBlock(4, 5, cell.NewCell()),
		storage.NewCellBlock(5, 4, cell.NewCell()),
	}
}
