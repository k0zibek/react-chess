import { Board } from './Board';
import { Cell } from './Cell';
import { BOARD_SIZE } from './constants';

/** Перебирает все клетки доски. */
export function forEachCell(
	board: Board,
	callback: (cell: Cell, x: number, y: number) => void,
): void {
	for (let y = 0; y < BOARD_SIZE; y++) {
		for (let x = 0; x < BOARD_SIZE; x++) {
			callback(board.getCell(x, y), x, y);
		}
	}
}
