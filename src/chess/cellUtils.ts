import { Cell } from './board/Cell';
import { Figure } from './figures/Figure';

/** Возвращает фигуру на клетке или бросает ошибку. */
export function requireFigure(cell: Cell): Figure {
	const figure = cell.figure;
	if (!figure) {
		throw new Error(`Expected figure on cell (${cell.x}, ${cell.y})`);
	}
	return figure;
}
