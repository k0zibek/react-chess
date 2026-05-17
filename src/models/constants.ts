import { Colors } from './Colors';

export const BOARD_SIZE = 8;
export const KING_FILE = 4;

/** Направление пешки: белые вверх (-1), чёрные вниз (+1). */
export function getPawnDirection(color: Colors): number {
	return color === Colors.BLACK ? 1 : -1;
}

/** Цвет соперника. */
export function getOpponent(color: Colors): Colors {
	return color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
}

/** Клетка в пределах доски. */
export function isOnBoard(x: number, y: number): boolean {
	return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}
