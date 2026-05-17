import { Cell } from '../board/Cell';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';
import { SlidingMover } from './SlidingMover';

const BISHOP_DIRECTIONS: [number, number][] = [
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];

/** Слон: ходит по диагонали. */
export class Bishop extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.BISHOP);
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		return SlidingMover.getMoves(this.cell, ctx.board, BISHOP_DIRECTIONS, (target) =>
			this.canTargetCell(target),
		);
	}

	canAttackSquare(target: Cell): boolean {
		return SlidingMover.canAttack(this.cell, target, BISHOP_DIRECTIONS);
	}
}
