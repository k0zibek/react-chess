import { FigureNames } from './FigureNames';

/** Фигуры, в которые может превратиться пешка. */
export const PROMOTION_PIECES = [
	FigureNames.QUEEN,
	FigureNames.ROOK,
	FigureNames.BISHOP,
	FigureNames.KNIGHT,
] as const;
