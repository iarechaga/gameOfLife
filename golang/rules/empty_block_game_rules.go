package rules

const neededCellsToPopulate = 3

type EmptyRules interface {
	ShouldPopulate(neighboursAmount int) bool
}

type EmptyBlockGameRules struct{}

func NewEmptyBlockGameRules() *EmptyBlockGameRules {
	return &EmptyBlockGameRules{}
}

func (r *EmptyBlockGameRules) ShouldPopulate(neighboursAmount int) bool {
	return neighboursAmount == neededCellsToPopulate
}
