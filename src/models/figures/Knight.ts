import { Colors } from '../Colors';
import { Cell } from '../Cell';
import { isOnBoard } from '../constants';
import { GameState } from '../GameState';
import { Move } from '../Move';
import { Figure, FigureNames } from './Figure';
import blackLogo from '../../assets/black-knight.png';
import whiteLogo from '../../assets/white-knight.png';

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
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.KNIGHT;
	}

	getPseudoLegalMoves(state: GameState): Move[] {
		const moves: Move[] = [];

		for (const [dx, dy] of KNIGHT_OFFSETS) {
			const x = this.cell.x + dx;
			const y = this.cell.y + dy;
			if (!isOnBoard(x, y)) continue;

			const target = state.board.getCell(x, y);
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
