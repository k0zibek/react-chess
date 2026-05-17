import { Cell } from '../board/Cell';
import { KING_FILE, isOnBoard, CASTLING_SIDES, CastlingSide } from '../constants';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';

/** Король: ход на одну клетку и рокировка. */
export class King extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.KING);
	}

	onMoved(): void {
		this.hasMoved = true;
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		const moves: Move[] = [];

		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) continue;
				const x = this.cell.x + dx;
				const y = this.cell.y + dy;
				if (!isOnBoard(x, y)) continue;

				const target = ctx.board.getCell(x, y);
				if (target.isEmpty() || this.canTargetCell(target)) {
					moves.push(new Move(this.cell, target, 'normal'));
				}
			}
		}

		moves.push(...this.getCastlingMoves(ctx));
		return moves;
	}

	canAttackSquare(target: Cell): boolean {
		const dx = Math.abs(target.x - this.cell.x);
		const dy = Math.abs(target.y - this.cell.y);
		return dx <= 1 && dy <= 1;
	}

	private getCastlingMoves(ctx: MoveContext): Move[] {
		if (this.hasMoved || this.cell.x !== KING_FILE) return [];

		const moves: Move[] = [];
		const board = ctx.board;
		const y = this.cell.y;

		for (const side of Object.keys(CASTLING_SIDES) as CastlingSide[]) {
			if (!ctx.castling.isAllowed(this.color, side)) continue;

			const config = CASTLING_SIDES[side];
			const rookCell = board.getCell(config.rookFromX, y);
			const rook = rookCell.figure;

			const pathClear = config.emptyX.every((x: number) => board.getCell(x, y).isEmpty());
			if (!pathClear || rook?.name !== FigureNames.ROOK || rook.hasMoved) continue;

			moves.push(new Move(this.cell, board.getCell(config.kingToX, y), 'castle'));
		}

		return moves;
	}
}
