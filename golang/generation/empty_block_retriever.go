package generation

import "gameoflife/storage"

type BlockRetriever interface {
	Retrieve(occupiedCell *storage.CellBlock, petriDish storage.PetriDish) []*storage.CellBlock
}

type EmptyBlockRetriever struct{}

func NewEmptyBlockRetriever() *EmptyBlockRetriever {
	return &EmptyBlockRetriever{}
}

func (r *EmptyBlockRetriever) Retrieve(occupiedCell *storage.CellBlock, petriDish storage.PetriDish) []*storage.CellBlock {
	var empty []*storage.CellBlock
	for _, cellBlock := range petriDish.Neighbours(occupiedCell) {
		if !cellBlock.ContainsCell() {
			empty = append(empty, cellBlock)
		}
	}
	return empty
}
