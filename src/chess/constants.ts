import { Colors, FigureNames } from './types';

export const BOARD_SIZE = 8;
export const KING_FILE = 4;
/** Максимальная глубина истории для undo. */
export const MAX_UNDO_HISTORY = 50;

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

/** Фигуры, в которые может превратиться пешка. */
export const PROMOTION_PIECES = [
	FigureNames.QUEEN,
	FigureNames.ROOK,
	FigureNames.BISHOP,
	FigureNames.KNIGHT,
] as const;

/** Геометрия одной стороны рокировки. */
export interface CastlingSideConfig {
	kingToX: number;
	rookFromX: number;
	rookToX: number;
	emptyX: number[];
}

export const CASTLING_SIDES = {
	kingside: { kingToX: 6, rookFromX: 7, rookToX: 5, emptyX: [5, 6] },
	queenside: { kingToX: 2, rookFromX: 0, rookToX: 3, emptyX: [1, 2, 3] },
} as const satisfies Record<string, CastlingSideConfig>;

export type CastlingSide = keyof typeof CASTLING_SIDES;
