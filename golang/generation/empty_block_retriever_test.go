package generation_test

import (
	"gameoflife/cell"
	"gameoflife/generation"
	"gameoflife/storage"
	"testing"
)

type stubNeighboursDish struct {
	storage.PetriDish
	neighbours []*storage.CellBlock
}

func (s *stubNeighboursDish) Neighbours(_ *storage.CellBlock) []*storage.CellBlock {
	return s.neighbours
}

func buildBlockList(numEmpty, numFilled int) []*storage.CellBlock {
	var blocks []*storage.CellBlock
	for i := 0; i < numEmpty; i++ {
		blocks = append(blocks, storage.NewEmptyCellBlock(i, 1))
	}
	for i := 0; i < numFilled; i++ {
		blocks = append(blocks, storage.NewCellBlock(i, 1, cell.NewCell()))
	}
	return blocks
}

func TestShouldReturnAllEmptyBlocks(t *testing.T) {
	retriever := generation.NewEmptyBlockRetriever()
	dish := &stubNeighboursDish{neighbours: buildBlockList(2, 5)}

	result := retriever.Retrieve(storage.NewCellBlock(0, 0, cell.NewCell()), dish)

	if len(result) != 2 {
		t.Fatalf("expected 2 empty blocks, got %d", len(result))
	}
	for _, b := range result {
		if b.ContainsCell() {
			t.Fatal("expected only empty blocks")
		}
	}
}

func TestShouldReturnNoEmptyBlocks(t *testing.T) {
	retriever := generation.NewEmptyBlockRetriever()
	dish := &stubNeighboursDish{neighbours: buildBlockList(0, 5)}

	result := retriever.Retrieve(storage.NewCellBlock(0, 0, cell.NewCell()), dish)

	if len(result) != 0 {
		t.Fatalf("expected 0 empty blocks, got %d", len(result))
	}
}
