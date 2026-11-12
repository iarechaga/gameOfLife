package game

import (
	"fmt"
	"gameoflife/storage"
	"io"
	"os"
)

const (
	livingCellSymbol = '▦'
	emptyCellSymbol  = '□'
)

type ConsolePetriDishPrinter struct {
	out io.Writer
}

func NewConsolePetriDishPrinter() *ConsolePetriDishPrinter {
	return &ConsolePetriDishPrinter{out: os.Stdout}
}

func NewPetriDishPrinter(out io.Writer) *ConsolePetriDishPrinter {
	return &ConsolePetriDishPrinter{out: out}
}

func (p *ConsolePetriDishPrinter) Print(dish storage.PetriDish) {
	dishRange := dish.Range()

	for row := 0; row < dishRange; row++ {
		for column := 0; column < dishRange; column++ {
			cellBlock := dish.Cell(row, column)
			if cellBlock.ContainsLivingCell() {
				fmt.Fprintf(p.out, "%c ", livingCellSymbol)
			} else {
				fmt.Fprintf(p.out, "%c ", emptyCellSymbol)
			}
		}
		fmt.Fprintln(p.out)
	}
}
