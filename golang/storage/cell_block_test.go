package storage_test

import (
	"errors"
	"gameoflife/cell"
	"gameoflife/storage"
	"testing"
)

const (
	coordinateX = 2
	coordinateY = 3
)

func TestShouldNotContainCell(t *testing.T) {
	cellBlock := storage.NewEmptyCellBlock(coordinateX, coordinateY)

	if cellBlock.ContainsCell() {
		t.Fatal("expected empty block not to contain cell")
	}
}

func TestShouldContainCell(t *testing.T) {
	cellBlock := storage.NewCellBlock(coordinateX, coordinateY, cell.NewCell())

	if !cellBlock.ContainsCell() {
		t.Fatal("expected block to contain cell")
	}
}

func TestShouldKeepGivenPositions(t *testing.T) {
	cellBlock := storage.NewCellBlock(coordinateX, coordinateY, cell.NewCell())

	if cellBlock.X() != coordinateX {
		t.Fatalf("expected X=%d, got %d", coordinateX, cellBlock.X())
	}
	if cellBlock.Y() != coordinateY {
		t.Fatalf("expected Y=%d, got %d", coordinateY, cellBlock.Y())
	}
}

func TestCannotKillEmptyBlockCell(t *testing.T) {
	cellBlock := storage.NewEmptyCellBlock(0, 0)

	err := cellBlock.Kill()
	if !errors.Is(err, storage.ErrInvalidUsageOfNull) {
		t.Fatalf("expected ErrInvalidUsageOfNull, got %v", err)
	}
}
