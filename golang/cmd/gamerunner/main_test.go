package main

import (
	"bytes"
	"gameoflife/game"
	"strings"
	"testing"
	"time"
)

func TestRunTheGameSmoke(t *testing.T) {
	ctx := game.NewApplicationConfiguration().CreateContext(10)
	var out bytes.Buffer
	printer := game.NewPetriDishPrinter(&out)

	if err := runTheGame(ctx.Game, printer, ctx.LivingCellBlockGenerator, 2, time.Millisecond); err != nil {
		t.Fatalf("unexpected error running game: %v", err)
	}

	rendered := out.String()
	if !strings.Contains(rendered, "▦") || !strings.Contains(rendered, "□") {
		t.Fatalf("expected board symbols in output, got:\n%s", rendered)
	}
}
