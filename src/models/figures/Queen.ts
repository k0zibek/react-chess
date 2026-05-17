import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { GameState } from '../GameState';
import { Move } from '../Move';
import { FigureNames } from '../FigureNames';
import blackLogo from '../../assets/black-queen.png';
import whiteLogo from '../../assets/white-queen.png';
import { Rook } from './Rook';

/** Ферзь: ходит как ладья и слон. */
export class Queen extends Rook {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.QUEEN;
	}

	getPseudoLegalMoves(state: GameState): Move[] {
		return this.getSlidingMoves(state, [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1],
		]);
	}

	canAttackSquare(target: Cell): boolean {
		return (
			this.cell.isEmptyVertical(target) ||
			this.cell.isEmptyHorizontal(target) ||
			this.cell.isEmptyDiagonal(target)
		);
	}
}
