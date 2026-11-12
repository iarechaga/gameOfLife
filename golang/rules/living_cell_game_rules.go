package rules

const (
	fewCellsLimit = 2
	tooManyCells  = 3
)

type LivingRules interface {
	ShouldDie(neighbours int) bool
}

type LivingCellGameRules struct{}

func NewLivingCellGameRules() *LivingCellGameRules {
	return &LivingCellGameRules{}
}

func (r *LivingCellGameRules) ShouldDie(neighbours int) bool {
	return neighbours < fewCellsLimit || neighbours > tooManyCells
}
