import { Cell } from '../board/Cell';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { Figure } from './Figure';
import { SlidingMover } from './SlidingMover';

const ROOK_DIRECTIONS: [number, number][] = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
];

/** Ладья: ходит по вертикали и горизонтали. */
export class Rook extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell, FigureNames.ROOK);
	}

	onMoved(): void {
		this.hasMoved = true;
	}

	getPseudoLegalMoves(ctx: MoveContext): Move[] {
		return SlidingMover.getMoves(this.cell, ctx.board, ROOK_DIRECTIONS, (target) =>
			this.canTargetCell(target),
		);
	}

	canAttackSquare(target: Cell): boolean {
		return SlidingMover.canAttack(this.cell, target, ROOK_DIRECTIONS);
	}
}
