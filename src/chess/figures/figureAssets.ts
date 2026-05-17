import { Colors, FigureNames } from '../types';
import blackBishop from '../../assets/black-bishop.png';
import blackKing from '../../assets/black-king.png';
import blackKnight from '../../assets/black-knight.png';
import blackPawn from '../../assets/black-pawn.png';
import blackQueen from '../../assets/black-queen.png';
import blackRook from '../../assets/black-rook.png';
import whiteBishop from '../../assets/white-bishop.png';
import whiteKing from '../../assets/white-king.png';
import whiteKnight from '../../assets/white-knight.png';
import whitePawn from '../../assets/white-pawn.png';
import whiteQueen from '../../assets/white-queen.png';
import whiteRook from '../../assets/white-rook.png';

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
