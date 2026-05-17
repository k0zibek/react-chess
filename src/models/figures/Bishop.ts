import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { GameState } from '../GameState';
import { Move } from '../Move';
import { FigureNames } from '../FigureNames';
import blackLogo from '../../assets/black-bishop.png';
import whiteLogo from '../../assets/white-bishop.png';
import { Rook } from './Rook';

/** Слон: ходит по диагонали. */
export class Bishop extends Rook {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.BISHOP;
	}

	getPseudoLegalMoves(state: GameState): Move[] {
		return this.getSlidingMoves(state, [
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1],
		]);
	}

	canAttackSquare(target: Cell): boolean {
		return this.cell.isEmptyDiagonal(target);
	}
}
