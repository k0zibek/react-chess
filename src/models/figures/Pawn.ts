import { Colors } from '../Colors';
import { getPawnDirection } from '../constants';
import { GameState } from '../GameState';
import { Move } from '../Move';
import { PROMOTION_PIECES } from '../promotion';
import { Cell } from '../Cell';
import { Figure, FigureNames } from './Figure';
import blackLogo from '../../assets/black-pawn.png';
import whiteLogo from '../../assets/white-pawn.png';

/** Пешка: ход вперёд, взятие, en passant и превращение. */
export class Pawn extends Figure {
	isFirstStep = true;

	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.PAWN;
	}

	getPseudoLegalMoves(state: GameState): Move[] {
		const moves: Move[] = [];
		const direction = getPawnDirection(this.color);
		const board = state.board;

		this.addForwardMoves(moves, board, direction);
		this.addCaptureMoves(moves, board, state, direction);
		return moves;
	}

	canAttackSquare(target: Cell): boolean {
		const direction = getPawnDirection(this.color);
		return (
			target.y === this.cell.y + direction &&
			(target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
		);
	}

	moveFigure(target: Cell): void {
		void target;
		this.isFirstStep = false;
	}

	private addForwardMoves(moves: Move[], board: GameState['board'], direction: number): void {
		const forwardY = this.cell.y + direction;
		if (forwardY < 0 || forwardY > 7) return;

		const forwardCell = board.getCell(this.cell.x, forwardY);
		if (!forwardCell.isEmpty()) return;

		moves.push(...this.createMovesTo(forwardCell));

		if (!this.isFirstStep) return;

		const doubleCell = board.getCell(this.cell.x, this.cell.y + direction * 2);
		if (doubleCell.isEmpty()) {
			moves.push(new Move(this.cell, doubleCell, 'normal'));
		}
	}

	private addCaptureMoves(
		moves: Move[],
		board: GameState['board'],
		state: GameState,
		direction: number,
	): void {
		for (const dx of [-1, 1]) {
			const captureX = this.cell.x + dx;
			const captureY = this.cell.y + direction;
			if (captureX < 0 || captureX > 7 || captureY < 0 || captureY > 7) continue;

			const target = board.getCell(captureX, captureY);

			if (this.cell.isEnemy(target)) {
				moves.push(...this.createMovesTo(target));
			} else if (state.enPassantTarget === target) {
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
