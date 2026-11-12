package storage

import "slices"

type PetriDish interface {
	Add(cellBlock *CellBlock) error
	Range() int
	Cell(row, column int) *CellBlock
	CleanDeadCells()
	OccupiedCells() []*CellBlock
	Neighbours(cellBlock *CellBlock) []*CellBlock
}

type SquaredPetriDish struct {
	size        int
	cellStorage map[int]map[int]*CellBlock
}

func NewSquaredPetriDish(size int) *SquaredPetriDish {
	return &SquaredPetriDish{
		size:        size,
		cellStorage: make(map[int]map[int]*CellBlock),
	}
}

func (d *SquaredPetriDish) Add(cellBlock *CellBlock) error {
	if d.outOfBoundsBlock(cellBlock) {
		return &BlockOutOfLimitsError{
			X:     cellBlock.X(),
			Y:     cellBlock.Y(),
			Limit: d.size,
		}
	}

	blocksRow, exists := d.cellStorage[cellBlock.X()]
	if !exists {
		blocksRow = make(map[int]*CellBlock)
		d.cellStorage[cellBlock.X()] = blocksRow
	}
	blocksRow[cellBlock.Y()] = cellBlock
	return nil
}

func (d *SquaredPetriDish) Range() int {
	return d.size
}

func (d *SquaredPetriDish) Cell(row, column int) *CellBlock {
	if blocksRow, ok := d.cellStorage[row]; ok {
		if block, ok := blocksRow[column]; ok {
			return block
		}
	}
	return NewEmptyCellBlock(row, column)
}

func (d *SquaredPetriDish) CleanDeadCells() {
	for _, block := range d.OccupiedCells() {
		if !block.ContainsLivingCell() {
			if row, ok := d.cellStorage[block.X()]; ok {
				delete(row, block.Y())
			}
		}
	}
}

func (d *SquaredPetriDish) OccupiedCells() []*CellBlock {
	rows := make([]int, 0, len(d.cellStorage))
	for r := range d.cellStorage {
		rows = append(rows, r)
	}
	slices.Sort(rows)

	var occupied []*CellBlock
	for _, r := range rows {
		rowMap := d.cellStorage[r]
		cols := make([]int, 0, len(rowMap))
		for c := range rowMap {
			cols = append(cols, c)
		}
		slices.Sort(cols)

		for _, c := range cols {
			block := rowMap[c]
			if block.ContainsCell() {
				occupied = append(occupied, block)
			}
		}
	}
	return occupied
}

func (d *SquaredPetriDish) Neighbours(cellBlock *CellBlock) []*CellBlock {
	rows := d.calculateRangePossibilities(cellBlock.X())
	columns := d.calculateRangePossibilities(cellBlock.Y())

	neighbours := make([]*CellBlock, 0, 8)
	for _, rowNumber := range rows {
		for _, columnNumber := range columns {
			if rowNumber == cellBlock.X() && columnNumber == cellBlock.Y() {
				continue
			}
			neighbours = append(neighbours, d.Cell(rowNumber, columnNumber))
		}
	}
	return neighbours
}

func (d *SquaredPetriDish) calculateRangePossibilities(index int) []int {
	start := max(index-1, 0)
	finish := index + 1
	if finish >= d.size {
		finish = d.size
	}

	possibilities := make([]int, 0, finish-start+1)
	for i := start; i <= finish; i++ {
		possibilities = append(possibilities, i)
	}
	return possibilities
}

func (d *SquaredPetriDish) outOfBoundsBlock(cellBlock *CellBlock) bool {
	return d.outOfBoundsPosition(cellBlock.X()) || d.outOfBoundsPosition(cellBlock.Y())
}

func (d *SquaredPetriDish) outOfBoundsPosition(position int) bool {
	return position > d.size || position < 0
}
