package cell_test

import (
	"errors"
	"gameoflife/cell"
	"testing"
)

func TestShouldBeAliveFromStart(t *testing.T) {
	c := cell.NewCell()

	if !c.Alive() {
		t.Fatal("expected cell to be alive from start")
	}
}

func TestShouldBeDeadAfterKillingCell(t *testing.T) {
	c := cell.NewCell()

	if err := c.Die(); err != nil {
		t.Fatalf("unexpected error killing cell: %v", err)
	}

	if c.Alive() {
		t.Fatal("expected cell to be dead after killing")
	}
}

func TestCannotKillTwiceACell(t *testing.T) {
	c := cell.NewCell()

	if err := c.Die(); err != nil {
		t.Fatalf("unexpected error on first kill: %v", err)
	}

	err := c.Die()
	if !errors.Is(err, cell.ErrCellAlreadyKilled) {
		t.Fatalf("expected ErrCellAlreadyKilled, got %v", err)
	}
}
