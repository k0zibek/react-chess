import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { isOnBoard } from '../constants';
import { GameState } from '../GameState';
import { Move } from '../Move';
import { Figure, FigureNames } from './Figure';
import blackLogo from '../../assets/black-rook.png';
import whiteLogo from '../../assets/white-rook.png';

/** Ладья: ходит по вертикали и горизонтали. */
export class Rook extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.ROOK;
	}

	getPseudoLegalMoves(state: GameState): Move[] {
		return this.getSlidingMoves(state, [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		]);
	}

	canAttackSquare(target: Cell): boolean {
		return this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target);
	}

	protected getSlidingMoves(state: GameState, directions: [number, number][]): Move[] {
		const moves: Move[] = [];

		for (const [dx, dy] of directions) {
			let x = this.cell.x + dx;
			let y = this.cell.y + dy;

			while (isOnBoard(x, y)) {
				const target = state.board.getCell(x, y);
				if (target.isEmpty()) {
					moves.push(new Move(this.cell, target, 'normal'));
				} else {
					if (this.canTargetCell(target)) {
						moves.push(new Move(this.cell, target, 'normal'));
					}
					break;
				}
				x += dx;
				y += dy;
			}
		}

		return moves;
	}
}
