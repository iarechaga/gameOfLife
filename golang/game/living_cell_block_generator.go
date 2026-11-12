package game

import (
	"crypto/rand"
	"gameoflife/cell"
	"gameoflife/storage"
	"math/big"
)

type LivingCellBlockGenerator struct{}

func NewLivingCellBlockGenerator() *LivingCellBlockGenerator {
	return &LivingCellBlockGenerator{}
}

func (g *LivingCellBlockGenerator) SmallExploder(dishRange int) []*storage.CellBlock {
	randomRow := randomInRange(1, max(2, dishRange-2))
	randomColumn := randomInRange(1, max(2, dishRange-1))

	return []*storage.CellBlock{
		storage.NewCellBlock(randomRow-1, randomColumn, cell.NewCell()),
		storage.NewCellBlock(randomRow, randomColumn-1, cell.NewCell()),
		storage.NewCellBlock(randomRow, randomColumn, cell.NewCell()),
		storage.NewCellBlock(randomRow, randomColumn+1, cell.NewCell()),
		storage.NewCellBlock(randomRow+1, randomColumn-1, cell.NewCell()),
		storage.NewCellBlock(randomRow+1, randomColumn+1, cell.NewCell()),
		storage.NewCellBlock(randomRow+2, randomColumn, cell.NewCell()),
	}
}

func randomInRange(minInclusive, maxExclusive int) int {
	span := maxExclusive - minInclusive
	if span <= 0 {
		return minInclusive
	}
	n, err := rand.Int(rand.Reader, big.NewInt(int64(span)))
	if err != nil {
		return minInclusive
	}
	return minInclusive + int(n.Int64())
}
