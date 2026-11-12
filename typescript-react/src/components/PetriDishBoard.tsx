import { memo } from 'react';
import { SquaredPetriDish } from '../storage/SquaredPetriDish.ts';

interface CellTileProps {
  row: number;
  column: number;
  alive: boolean;
  onToggle: (row: number, column: number) => void;
}

const CellTile = memo(function CellTile({ row, column, alive, onToggle }: CellTileProps) {
  return (
    <button
      type="button"
      className={`cell-tile ${alive ? 'cell-alive' : 'cell-empty'}`}
      aria-label={`Celda (${row}, ${column}) ${alive ? 'viva' : 'vacía'}`}
      onClick={() => onToggle(row, column)}
    />
  );
});

interface PetriDishBoardProps {
  dish: SquaredPetriDish;
  onToggleCell: (row: number, column: number) => void;
}

/**
 * Equivalente declarativo en React al ConsolePetriDishPrinter de Java.
 */
export function PetriDishBoard({ dish, onToggleCell }: PetriDishBoardProps) {
  const range = dish.getRange();
  const tiles = [];

  for (let row = 0; row < range; row++) {
    for (let column = 0; column < range; column++) {
      const alive = dish.getCell(row, column).containsLivingCell();
      tiles.push(
        <CellTile
          key={`${row}-${column}`}
          row={row}
          column={column}
          alive={alive}
          onToggle={onToggleCell}
        />,
      );
    }
  }

  return (
    <div
      className="petri-dish-board"
      style={{ gridTemplateColumns: `repeat(${range}, 24px)` }}
    >
      {tiles}
    </div>
  );
}
