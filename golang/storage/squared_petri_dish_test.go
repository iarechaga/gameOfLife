package storage_test

import (
	"errors"
	"gameoflife/cell"
	"gameoflife/storage"
	"testing"
)

const dishSize = 100

func TestShouldStoreCellBlock(t *testing.T) {
	dish := storage.NewSquaredPetriDish(dishSize)
	cellBlock := storage.NewCellBlock(1, 2, cell.NewCell())

	if err := dish.Add(cellBlock); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if got := len(dish.OccupiedCells()); got != 1 {
		t.Fatalf("expected 1 occupied cell, got %d", got)
	}
}

func TestShouldBeAbleToRetrieveAnIncludedCell(t *testing.T) {
	dish := storage.NewSquaredPetriDish(dishSize)
	cellBlock := storage.NewCellBlock(1, 2, cell.NewCell())
	_ = dish.Add(cellBlock)

	returned := dish.Cell(1, 2)

	if !returned.Equals(cellBlock) {
		t.Fatal("expected returned cell block to equal added cell block")
	}
}

func TestShouldReturnEmptyCellBlock(t *testing.T) {
	dish := storage.NewSquaredPetriDish(dishSize)

	returned := dish.Cell(1, 2)

	if returned.ContainsCell() {
		t.Fatal("expected empty cell block")
	}
}

func TestShouldReturnErrorWhenOutOfLimits(t *testing.T) {
	cases := []struct {
		name string
		x    int
		y    int
	}{
		{"wrong horizontal position", 101, 2},
		{"wrong negative horizontal position", -101, 2},
		{"wrong vertical position", 2, 101},
		{"wrong negative vertical position", 2, -101},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			dish := storage.NewSquaredPetriDish(dishSize)
			err := dish.Add(storage.NewCellBlock(tc.x, tc.y, cell.NewCell()))
			if !errors.Is(err, storage.ErrBlockOutOfLimits) {
				t.Fatalf("expected ErrBlockOutOfLimits, got %v", err)
			}
		})
	}
}

func TestShouldCleanDeadCells(t *testing.T) {
	dish := storage.NewSquaredPetriDish(10)
	cellToBeKilled := storage.NewCellBlock(2, 2, cell.NewCell())
	_ = dish.Add(cellToBeKilled)
	_ = dish.Add(storage.NewCellBlock(1, 2, cell.NewCell()))
	_ = dish.Add(storage.NewCellBlock(1, 3, cell.NewCell()))

	if got := len(dish.OccupiedCells()); got != 3 {
		t.Fatalf("expected 3 occupied cells, got %d", got)
	}

	if err := cellToBeKilled.Kill(); err != nil {
		t.Fatalf("unexpected error killing cell: %v", err)
	}

	if got := len(dish.OccupiedCells()); got != 3 {
		t.Fatalf("expected 3 occupied cells before cleanup, got %d", got)
	}

	dish.CleanDeadCells()

	if got := len(dish.OccupiedCells()); got != 2 {
		t.Fatalf("expected 2 occupied cells after cleanup, got %d", got)
	}
}

func TestShouldReturnThreeNeighboursForCornerBlock(t *testing.T) {
	dish := storage.NewSquaredPetriDish(10)
	targetBlock := storage.NewEmptyCellBlock(0, 0)

	neighbours := dish.Neighbours(targetBlock)

	if len(neighbours) != 3 {
		t.Fatalf("expected 3 neighbours, got %d", len(neighbours))
	}
	if containsBlock(neighbours, targetBlock) {
		t.Fatal("neighbours should not contain targetBlock itself")
	}
	if !containsBlock(neighbours, storage.NewEmptyCellBlock(0, 1)) ||
		!containsBlock(neighbours, storage.NewEmptyCellBlock(1, 0)) ||
		!containsBlock(neighbours, storage.NewEmptyCellBlock(1, 1)) {
		t.Fatal("missing expected corner neighbours")
	}
}

func TestShouldReturnEightNeighboursForCenteredBlock(t *testing.T) {
	dish := storage.NewSquaredPetriDish(10)
	targetBlock := storage.NewEmptyCellBlock(3, 3)

	neighbours := dish.Neighbours(targetBlock)

	if len(neighbours) != 8 {
		t.Fatalf("expected 8 neighbours, got %d", len(neighbours))
	}
	if containsBlock(neighbours, targetBlock) {
		t.Fatal("neighbours should not contain targetBlock itself")
	}
}

func containsBlock(blocks []*storage.CellBlock, target *storage.CellBlock) bool {
	for _, b := range blocks {
		if b.Equals(target) {
			return true
		}
	}
	return false
}
