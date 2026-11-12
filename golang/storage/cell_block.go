package storage

import "gameoflife/cell"

type CellBlock struct {
	x       int
	y       int
	content cell.Cell
}

func NewEmptyCellBlock(x, y int) *CellBlock {
	return &CellBlock{
		x:       x,
		y:       y,
		content: cell.GetNullCell(),
	}
}

func NewCellBlock(x, y int, c cell.Cell) *CellBlock {
	if c == nil {
		c = cell.GetNullCell()
	}
	return &CellBlock{
		x:       x,
		y:       y,
		content: c,
	}
}

func (b *CellBlock) X() int {
	return b.x
}

func (b *CellBlock) Y() int {
	return b.y
}

func (b *CellBlock) ContainsCell() bool {
	return b.content != cell.GetNullCell()
}

func (b *CellBlock) ContainsLivingCell() bool {
	return b.ContainsCell() && b.content.Alive()
}

func (b *CellBlock) Kill() error {
	return b.content.Die()
}

func (b *CellBlock) Equals(other *CellBlock) bool {
	if other == nil {
		return false
	}
	return b.x == other.x &&
		b.y == other.y &&
		b.ContainsCell() == other.ContainsCell()
}
