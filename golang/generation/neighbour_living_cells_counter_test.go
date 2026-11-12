package generation_test

import (
	"gameoflife/cell"
	"gameoflife/generation"
	"gameoflife/storage"
	"testing"
)

func TestShouldCountThreeLivingCells(t *testing.T) {
	counter := generation.NewNeighbourLivingCellsCounter()
	cellBlocks := []*storage.CellBlock{
		storage.NewCellBlock(1, 2, cell.NewCell()),
		storage.NewCellBlock(1, 2, cell.NewCell()),
		storage.NewCellBlock(1, 2, cell.NewCell()),
		storage.NewEmptyCellBlock(1, 2),
		storage.NewEmptyCellBlock(1, 2),
		storage.NewEmptyCellBlock(1, 2),
	}

	if got := counter.Count(cellBlocks); got != 3 {
		t.Fatalf("expected count=3, got %d", got)
	}
}

func TestShouldCountZeroLivingCells(t *testing.T) {
	counter := generation.NewNeighbourLivingCellsCounter()
	cellBlocks := []*storage.CellBlock{
		storage.NewEmptyCellBlock(1, 2),
		storage.NewEmptyCellBlock(1, 2),
		storage.NewEmptyCellBlock(1, 2),
	}

	if got := counter.Count(cellBlocks); got != 0 {
		t.Fatalf("expected count=0, got %d", got)
	}
}
