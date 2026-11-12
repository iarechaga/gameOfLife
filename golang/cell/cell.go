package cell

import "errors"

var (
	ErrCellAlreadyKilled  = errors.New("cell has already been killed")
	ErrInvalidUsageOfNull = errors.New("trying to kill a null cell")
)

type Cell interface {
	Alive() bool
	Die() error
}

type livingCell struct {
	alive bool
}

func NewCell() Cell {
	return &livingCell{alive: true}
}

func (c *livingCell) Alive() bool {
	return c.alive
}

func (c *livingCell) Die() error {
	if !c.Alive() {
		return ErrCellAlreadyKilled
	}
	c.alive = false
	return nil
}
