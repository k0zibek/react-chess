import { getPawnDirection, PROMOTION_PIECES } from '../constants';
import { Board } from '../board/Board';
import { Cell } from '../board/Cell';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';

/** Пешка: ход вперёд, взятие, en passant и превращение. */
export class Pawn extends Figure {
	isFirstStep = true;

	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.PAWN);
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		const moves: Move[] = [];
		const direction = getPawnDirection(this.color);

		this.addForwardMoves(moves, ctx.board, direction);
		this.addCaptureMoves(moves, ctx.board, ctx, direction);
		return moves;
	}

	/** Сбрасывает флаг первого хода после перемещения. */
	markMoved(): void {
		this.isFirstStep = false;
	}

	canAttackSquare(target: Cell): boolean {
		const direction = getPawnDirection(this.color);
		return (
			target.y === this.cell.y + direction &&
			(target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
		);
	}

	private addForwardMoves(moves: Move[], board: Board, direction: number): void {
		const forwardY = this.cell.y + direction;
		if (forwardY < 0 || forwardY > 7) return;

		const forwardCell = board.getCell(this.cell.x, forwardY);
		if (!forwardCell.isEmpty()) return;

		moves.push(...this.createMovesTo(forwardCell));

		if (!this.isFirstStep) return;

		const doubleY = this.cell.y + direction * 2;
		if (doubleY < 0 || doubleY > 7) return;

		const doubleCell = board.getCell(this.cell.x, doubleY);
		if (doubleCell.isEmpty()) {
			moves.push(new Move(this.cell, doubleCell, 'normal'));
		}
	}

	private addCaptureMoves(
		moves: Move[],
		board: Board,
		ctx: MoveContext,
		direction: number,
	): void {
		for (const dx of [-1, 1]) {
			const captureX = this.cell.x + dx;
			const captureY = this.cell.y + direction;
			if (captureX < 0 || captureX > 7 || captureY < 0 || captureY > 7) continue;

			const target = board.getCell(captureX, captureY);

			if (this.cell.isEnemy(target)) {
				moves.push(...this.createMovesTo(target));
			} else if (ctx.enPassantTarget === target) {
				const captured = board.getCell(captureX, this.cell.y).figure;
				if (captured) {
					moves.push(new Move(this.cell, target, 'enPassant', undefined, captured));
				}
			}
		}
	}

	private createMovesTo(target: Cell): Move[] {
		if (Move.isPromotionRank(this.color, target.y)) {
			return PROMOTION_PIECES.map(
				(piece) => new Move(this.cell, target, 'promotion', piece),
			);
		}
		return [new Move(this.cell, target, 'normal')];
	}
}
