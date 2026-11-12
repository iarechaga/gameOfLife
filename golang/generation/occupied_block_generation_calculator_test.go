package generation_test

import (
	"gameoflife/cell"
	"gameoflife/generation"
	"gameoflife/storage"
	"slices"
	"testing"
)

type spyDish struct {
	occupied   []*storage.CellBlock
	neighbours []*storage.CellBlock
	added      []*storage.CellBlock
	cleaned    bool
	calls      *[]string
}

func (s *spyDish) record(call string) {
	if s.calls != nil {
		*s.calls = append(*s.calls, call)
	}
}

func (s *spyDish) Add(cellBlock *storage.CellBlock) error {
	s.record("Add")
	s.added = append(s.added, cellBlock)
	return nil
}

func (s *spyDish) Range() int                           { return 10 }
func (s *spyDish) Cell(row, col int) *storage.CellBlock { return storage.NewEmptyCellBlock(row, col) }
func (s *spyDish) CleanDeadCells() {
	s.record("CleanDeadCells")
	s.cleaned = true
}

func (s *spyDish) OccupiedCells() []*storage.CellBlock {
	s.record("OccupiedCells")
	return s.occupied
}

func (s *spyDish) Neighbours(_ *storage.CellBlock) []*storage.CellBlock {
	s.record("Neighbours")
	return s.neighbours
}

type spyCounter struct {
	result int
	calls  *[]string
}

func (c *spyCounter) Count(_ []*storage.CellBlock) int {
	if c.calls != nil {
		*c.calls = append(*c.calls, "Count")
	}
	return c.result
}

type spyLivingRules struct {
	die   bool
	calls *[]string
}

func (r *spyLivingRules) ShouldDie(_ int) bool {
	if r.calls != nil {
		*r.calls = append(*r.calls, "ShouldDie")
	}
	return r.die
}

type spyCell struct {
	alive bool
	calls *[]string
}

func (c *spyCell) Alive() bool { return c.alive }
func (c *spyCell) Die() error {
	if c.calls != nil {
		*c.calls = append(*c.calls, "Kill")
	}
	c.alive = false
	return nil
}

func TestOccupiedShouldRetrieveCells(t *testing.T) {
	var calls []string
	dish := &spyDish{calls: &calls}
	calc := generation.NewOccupiedBlockGenerationCalculator(&spyCounter{}, &spyLivingRules{})

	if err := calc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !slices.Equal(calls, []string{"OccupiedCells"}) {
		t.Fatalf("expected [OccupiedCells], got %v", calls)
	}
}

func TestOccupiedShouldKillLivingCell(t *testing.T) {
	var calls []string
	innerCell := &spyCell{alive: true, calls: &calls}
	cellToDie := storage.NewCellBlock(1, 1, innerCell)
	dish := &spyDish{occupied: []*storage.CellBlock{cellToDie}, calls: &calls}
	counter := &spyCounter{result: 0, calls: &calls}
	livingRules := &spyLivingRules{die: true, calls: &calls}

	calc := generation.NewOccupiedBlockGenerationCalculator(counter, livingRules)
	if err := calc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := []string{"OccupiedCells", "Neighbours", "Count", "ShouldDie", "Kill"}
	if !slices.Equal(calls, expected) {
		t.Fatalf("expected call sequence %v, got %v", expected, calls)
	}
	if cellToDie.ContainsLivingCell() {
		t.Fatal("expected cellToDie to be dead")
	}
}

func TestOccupiedShouldNotKillLivingCell(t *testing.T) {
	var calls []string
	cellToLive := storage.NewCellBlock(1, 1, cell.NewCell())
	dish := &spyDish{occupied: []*storage.CellBlock{cellToLive}, calls: &calls}
	counter := &spyCounter{result: 2, calls: &calls}
	livingRules := &spyLivingRules{die: false, calls: &calls}

	calc := generation.NewOccupiedBlockGenerationCalculator(counter, livingRules)
	if err := calc.Evolve(dish); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := []string{"OccupiedCells", "Neighbours", "Count", "ShouldDie"}
	if !slices.Equal(calls, expected) {
		t.Fatalf("expected call sequence %v, got %v", expected, calls)
	}
	if !cellToLive.ContainsLivingCell() {
		t.Fatal("expected cellToLive to remain alive")
	}
}
