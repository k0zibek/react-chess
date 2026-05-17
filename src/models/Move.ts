import { Cell } from './Cell';
import { Colors } from './Colors';
import { FigureNames } from './FigureNames';
import { Figure } from './figures/Figure';

export type MoveType = 'normal' | 'castle' | 'enPassant' | 'promotion';

/** Value object описывающий ход на доске. */
export class Move {
	from: Cell;
	to: Cell;
	type: MoveType;
	promotionPiece?: FigureNames;
	capturedFigure?: Figure;

	constructor(
		from: Cell,
		to: Cell,
		type: MoveType = 'normal',
		promotionPiece?: FigureNames,
		capturedFigure?: Figure,
	) {
		this.from = from;
		this.to = to;
		this.type = type;
		this.promotionPiece = promotionPiece;
		this.capturedFigure = capturedFigure;
	}

	matches(other: Move): boolean {
		return (
			this.from === other.from &&
			this.to === other.to &&
			this.type === other.type &&
			this.promotionPiece === other.promotionPiece
		);
	}

	static isPromotionRank(color: Colors, y: number): boolean {
		return color === Colors.WHITE ? y === 0 : y === 7;
	}
}
