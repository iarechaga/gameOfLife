package generation

import "gameoflife/storage"

type CellCounter interface {
	Count(cellList []*storage.CellBlock) int
}

type NeighbourLivingCellsCounter struct{}

func NewNeighbourLivingCellsCounter() *NeighbourLivingCellsCounter {
	return &NeighbourLivingCellsCounter{}
}

func (c *NeighbourLivingCellsCounter) Count(cellList []*storage.CellBlock) int {
	total := 0
	for _, cellBlock := range cellList {
		if cellBlock.ContainsCell() {
			total++
		}
	}
	return total
}
