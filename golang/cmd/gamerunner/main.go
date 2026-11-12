package main

import (
	"fmt"
	"gameoflife/game"
	"log"
	"time"
)

const (
	maxIterations = 20
	oneSecond     = time.Second
)

func main() {
	ctx := game.NewApplicationConfiguration().CreateContext(game.DefaultPetriDishSize)
	if err := runTheGame(ctx.Game, ctx.Printer, ctx.LivingCellBlockGenerator, maxIterations, oneSecond); err != nil {
		log.Fatal(err)
	}
}

func runTheGame(
	g *game.Game,
	printer *game.ConsolePetriDishPrinter,
	generator *game.LivingCellBlockGenerator,
	iterations int,
	sleepDuration time.Duration,
) error {
	for _, block := range generator.SmallExploder(g.PetriDish().Range()) {
		if err := g.PetriDish().Add(block); err != nil {
			return err
		}
	}

	fmt.Println("Initial state :")
	printer.Print(g.PetriDish())

	for iteration := 1; iteration <= iterations; iteration++ {
		time.Sleep(sleepDuration)
		fmt.Printf("Iteration %d\n", iteration)
		if err := g.NextGeneration(); err != nil {
			return err
		}
		printer.Print(g.PetriDish())
	}

	return nil
}
