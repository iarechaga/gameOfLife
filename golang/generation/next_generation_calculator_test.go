package generation_test

import (
	"gameoflife/generation"
	"gameoflife/storage"
	"slices"
	"testing"
)

type spyStep struct {
	name  string
	calls *[]string
}

func (s *spyStep) Evolve(_ storage.PetriDish) error {
	*s.calls = append(*s.calls, s.name)
	return nil
}

func TestShouldEvolveFirstCellsAndThenEmptyBlocks(t *testing.T) {
	var calls []string
	occupiedStep := &spyStep{name: "occupied", calls: &calls}
	emptyStep := &spyStep{name: "empty", calls: &calls}
	dish := &spyDish{calls: &calls}

	nextCalc := generation.NewNextGenerationCalculator(occupiedStep, emptyStep)
	if err := nextCalc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := []string{"occupied", "empty", "CleanDeadCells"}
	if !slices.Equal(calls, expected) {
		t.Fatalf("expected sequence %v, got %v", expected, calls)
	}
}

func TestShouldRemoveDeadCells(t *testing.T) {
	var calls []string
	dish := &spyDish{calls: &calls}
	nextCalc := generation.NewNextGenerationCalculator(
		&spyStep{name: "occupied", calls: &calls},
		&spyStep{name: "empty", calls: &calls},
	)

	if err := nextCalc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !dish.cleaned {
		t.Fatal("expected CleanDeadCells to be called")
	}
}
