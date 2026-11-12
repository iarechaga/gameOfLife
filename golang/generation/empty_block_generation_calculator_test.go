package generation_test

import (
	"gameoflife/cell"
	"gameoflife/generation"
	"gameoflife/storage"
	"testing"
)

type spyEmptyRules struct {
	populate bool
}

func (r *spyEmptyRules) ShouldPopulate(_ int) bool {
	return r.populate
}

type spyRetriever struct {
	empty []*storage.CellBlock
}

func (r *spyRetriever) Retrieve(_ *storage.CellBlock, _ storage.PetriDish) []*storage.CellBlock {
	return r.empty
}

func TestShouldPopulateEmptyBlock(t *testing.T) {
	const (
		desiredX = 1
		desiredY = 2
	)
	emptyBlock := storage.NewEmptyCellBlock(desiredX, desiredY)
	occupiedCell := storage.NewEmptyCellBlock(desiredX+1, desiredY)

	dish := &spyDish{occupied: []*storage.CellBlock{occupiedCell}}
	calc := generation.NewEmptyBlockGenerationCalculator(
		&spyEmptyRules{populate: true},
		&spyCounter{result: 3},
		&spyRetriever{empty: []*storage.CellBlock{emptyBlock}},
	)

	if err := calc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := storage.NewCellBlock(desiredX, desiredY, cell.NewCell())
	if len(dish.added) != 1 || !dish.added[0].Equals(expected) {
		t.Fatalf("expected block (%d,%d) with living cell to be added", desiredX, desiredY)
	}
}

func TestShouldNotPopulateEmptyBlock(t *testing.T) {
	const (
		desiredX = 1
		desiredY = 2
	)
	emptyBlock := storage.NewEmptyCellBlock(desiredX, desiredY)
	occupiedCell := storage.NewEmptyCellBlock(desiredX+1, desiredY)

	dish := &spyDish{occupied: []*storage.CellBlock{occupiedCell}}
	calc := generation.NewEmptyBlockGenerationCalculator(
		&spyEmptyRules{populate: false},
		&spyCounter{result: 4},
		&spyRetriever{empty: []*storage.CellBlock{emptyBlock}},
	)

	if err := calc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(dish.added) != 0 {
		t.Fatalf("expected 0 blocks added, got %d", len(dish.added))
	}
}
