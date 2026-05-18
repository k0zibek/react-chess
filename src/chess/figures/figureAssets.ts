import { Colors, FigureNames } from '../types';
import blackBishop from '../../assets/black-bishop.svg';
import blackKing from '../../assets/black-king.svg';
import blackKnight from '../../assets/black-knight.svg';
import blackPawn from '../../assets/black-pawn.svg';
import blackQueen from '../../assets/black-queen.svg';
import blackRook from '../../assets/black-rook.svg';
import whiteBishop from '../../assets/white-bishop.svg';
import whiteKing from '../../assets/white-king.svg';
import whiteKnight from '../../assets/white-knight.svg';
import whitePawn from '../../assets/white-pawn.svg';
import whiteQueen from '../../assets/white-queen.svg';
import whiteRook from '../../assets/white-rook.svg';

const LOGOS: Record<Colors, Partial<Record<FigureNames, string>>> = {
	[Colors.WHITE]: {
		[FigureNames.KING]: whiteKing,
		[FigureNames.QUEEN]: whiteQueen,
		[FigureNames.ROOK]: whiteRook,
		[FigureNames.BISHOP]: whiteBishop,
		[FigureNames.KNIGHT]: whiteKnight,
		[FigureNames.PAWN]: whitePawn,
	},
	[Colors.BLACK]: {
		[FigureNames.KING]: blackKing,
		[FigureNames.QUEEN]: blackQueen,
		[FigureNames.ROOK]: blackRook,
		[FigureNames.BISHOP]: blackBishop,
		[FigureNames.KNIGHT]: blackKnight,
		[FigureNames.PAWN]: blackPawn,
	},
};

/** Возвращает URL иконки фигуры для заданного цвета. */
export function getFigureLogo(name: FigureNames, color: Colors): string | null {
	return LOGOS[color][name] ?? null;
}
