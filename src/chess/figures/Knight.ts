import { Cell } from '../board/Cell';
import { isOnBoard } from '../constants';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';

const KNIGHT_OFFSETS: [number, number][] = [
	[1, 2],
	[2, 1],
	[2, -1],
	[1, -2],
	[-1, -2],
	[-2, -1],
	[-2, 1],
	[-1, 2],
];

/** Конь: ходит буквой «Г». */
export class Knight extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.KNIGHT);
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		const moves: Move[] = [];

		for (const [dx, dy] of KNIGHT_OFFSETS) {
			const x = this.cell.x + dx;
			const y = this.cell.y + dy;
			if (!isOnBoard(x, y)) continue;

			const target = ctx.board.getCell(x, y);
			if (target.isEmpty() || this.canTargetCell(target)) {
				moves.push(new Move(this.cell, target, 'normal'));
			}
		}

		return moves;
	}

	canAttackSquare(target: Cell): boolean {
		const dx = Math.abs(this.cell.x - target.x);
		const dy = Math.abs(this.cell.y - target.y);
		return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
	}
}
