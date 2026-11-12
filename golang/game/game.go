package game

import "gameoflife/storage"

type EvolutionCalculator interface {
	Evolve(petriDish storage.PetriDish) error
}

type Game struct {
	petriDish                storage.PetriDish
	nextGenerationCalculator EvolutionCalculator
}

func NewGame(petriDish storage.PetriDish, nextGenerationCalculator EvolutionCalculator) *Game {
	return &Game{
		petriDish:                petriDish,
		nextGenerationCalculator: nextGenerationCalculator,
	}
}

func (g *Game) NextGeneration() error {
	return g.nextGenerationCalculator.Evolve(g.petriDish)
}

func (g *Game) PetriDish() storage.PetriDish {
	return g.petriDish
}
