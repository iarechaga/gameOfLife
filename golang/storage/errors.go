package storage

import (
	"errors"
	"fmt"
	"gameoflife/cell"
)

var (
	ErrBlockOutOfLimits   = errors.New("block out of limits")
	ErrInvalidUsageOfNull = cell.ErrInvalidUsageOfNull
)

type BlockOutOfLimitsError struct {
	X     int
	Y     int
	Limit int
}

func (e *BlockOutOfLimitsError) Error() string {
	return fmt.Sprintf("Trying to access %d,%d with limit of %d", e.X, e.Y, e.Limit)
}

func (e *BlockOutOfLimitsError) Unwrap() error {
	return ErrBlockOutOfLimits
}
