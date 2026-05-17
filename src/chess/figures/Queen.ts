import { Cell } from '../board/Cell';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';
import { SlidingMover } from './SlidingMover';

const QUEEN_DIRECTIONS: [number, number][] = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];

/** Ферзь: ходит как ладья и слон. */
export class Queen extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.QUEEN);
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		return SlidingMover.getMoves(
			this.cell,
			ctx.board,
			QUEEN_DIRECTIONS,
			(target) => this.canTargetCell(target),
		);
	}

	canAttackSquare(target: Cell): boolean {
		return SlidingMover.canAttack(this.cell, target, QUEEN_DIRECTIONS);
	}
}
