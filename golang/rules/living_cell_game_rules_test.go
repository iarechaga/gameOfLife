package rules_test

import (
	"gameoflife/rules"
	"testing"
)

func TestShouldDieWithFewNeighbours(t *testing.T) {
	gameRules := rules.NewLivingCellGameRules()

	for n := 0; n < 2; n++ {
		if !gameRules.ShouldDie(n) {
			t.Fatalf("expected cell to die with %d neighbours", n)
		}
	}
}

func TestShouldDieWithTooManyNeighbours(t *testing.T) {
	gameRules := rules.NewLivingCellGameRules()

	for n := 4; n < 10; n++ {
		if !gameRules.ShouldDie(n) {
			t.Fatalf("expected cell to die with %d neighbours", n)
		}
	}
}

func TestCellSurvivesWithTwoOrThreeNeighbours(t *testing.T) {
	gameRules := rules.NewLivingCellGameRules()

	for n := 2; n < 4; n++ {
		if gameRules.ShouldDie(n) {
			t.Fatalf("expected cell to survive with %d neighbours", n)
		}
	}
}
