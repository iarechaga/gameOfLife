package rules_test

import (
	"gameoflife/rules"
	"testing"
)

func TestShouldRemainEmptyWithFewNeighbours(t *testing.T) {
	gameRules := rules.NewEmptyBlockGameRules()

	for n := 0; n < 3; n++ {
		if gameRules.ShouldPopulate(n) {
			t.Fatalf("expected empty block to remain empty with %d neighbours", n)
		}
	}
}

func TestShouldRemainEmptyWithTooManyNeighbours(t *testing.T) {
	gameRules := rules.NewEmptyBlockGameRules()

	for n := 4; n < 10; n++ {
		if gameRules.ShouldPopulate(n) {
			t.Fatalf("expected empty block to remain empty with %d neighbours", n)
		}
	}
}

func TestShouldBecomePopulatedWithThreeNeighbours(t *testing.T) {
	gameRules := rules.NewEmptyBlockGameRules()

	if !gameRules.ShouldPopulate(3) {
		t.Fatal("expected empty block to become populated with 3 neighbours")
	}
}
