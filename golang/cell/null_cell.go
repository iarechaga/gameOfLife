package cell

type nullCell struct{}

var nullCellInstance Cell = &nullCell{}

func GetNullCell() Cell {
	return nullCellInstance
}

func (n *nullCell) Alive() bool {
	return false
}

func (n *nullCell) Die() error {
	return ErrInvalidUsageOfNull
}
