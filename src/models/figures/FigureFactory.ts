import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { FigureNames } from '../FigureNames';
import { Bishop } from './Bishop';
import { Figure } from './Figure';
import { King } from './King';
import { Knight } from './Knight';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { Rook } from './Rook';

/** Создаёт фигуру нужного типа на указанной клетке. */
export function createFigure(name: FigureNames, color: Colors, cell: Cell): Figure {
	const factories: Record<FigureNames, (color: Colors, cell: Cell) => Figure> = {
		[FigureNames.KING]: (c, cl) => new King(c, cl),
		[FigureNames.QUEEN]: (c, cl) => new Queen(c, cl),
		[FigureNames.ROOK]: (c, cl) => new Rook(c, cl),
		[FigureNames.BISHOP]: (c, cl) => new Bishop(c, cl),
		[FigureNames.KNIGHT]: (c, cl) => new Knight(c, cl),
		[FigureNames.PAWN]: (c, cl) => new Pawn(c, cl),
		[FigureNames.FIGURE]: (c, cl) => new Pawn(c, cl),
	};

	return factories[name](color, cell);
}
