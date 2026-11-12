package game

import (
	"gameoflife/generation"
	"gameoflife/rules"
	"gameoflife/storage"
)

const DefaultPetriDishSize = 20

type ApplicationContext struct {
	Game                     *Game
	Printer                  *ConsolePetriDishPrinter
	LivingCellBlockGenerator *LivingCellBlockGenerator
	NextGenerationCalculator *generation.NextGenerationCalculator
	PetriDish                *storage.SquaredPetriDish
}

type ApplicationConfiguration struct{}

func NewApplicationConfiguration() *ApplicationConfiguration {
	return &ApplicationConfiguration{}
}

func (c *ApplicationConfiguration) ConfigureDish(size int) *storage.SquaredPetriDish {
	return storage.NewSquaredPetriDish(size)
}

func (c *ApplicationConfiguration) CreateContext(dishSize int) *ApplicationContext {
	if dishSize <= 0 {
		dishSize = DefaultPetriDishSize
	}

	petriDish := c.ConfigureDish(dishSize)
	counter := generation.NewNeighbourLivingCellsCounter()
	livingCellRules := rules.NewLivingCellGameRules()
	emptyBlockRules := rules.NewEmptyBlockGameRules()
	emptyBlockRetriever := generation.NewEmptyBlockRetriever()

	occupiedCalculator := generation.NewOccupiedBlockGenerationCalculator(counter, livingCellRules)
	emptyCalculator := generation.NewEmptyBlockGenerationCalculator(emptyBlockRules, counter, emptyBlockRetriever)
	nextGenerationCalculator := generation.NewNextGenerationCalculator(occupiedCalculator, emptyCalculator)

	return &ApplicationContext{
		Game:                     NewGame(petriDish, nextGenerationCalculator),
		Printer:                  NewConsolePetriDishPrinter(),
		LivingCellBlockGenerator: NewLivingCellBlockGenerator(),
		NextGenerationCalculator: nextGenerationCalculator,
		PetriDish:                petriDish,
	}
}
