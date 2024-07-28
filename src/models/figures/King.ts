import { Figure, FigureNames } from './Figure';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import blackLogo from '../../assets/black-king.png';
import whiteLogo from '../../assets/white-king.png';

export class King extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
		this.name = FigureNames.KING;
	}

	isKingUnderAttack(target: Cell): boolean {
		if (!this.cell.isEmptyVertical(target)) return true;
		if (!this.cell.isEmptyHorizontal(target)) return true;
		if (!this.cell.isEmptyDiagonal(target)) return true;
		return false;
	}

	canMove(target: Cell): boolean {
		if (!super.canMove(target)) return false;
		const dx = Math.abs(target.x - this.cell.x);
		const dy = Math.abs(target.y - this.cell.y);
		// if ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) return false;

		return dx <= 1 && dy <= 1;
	}
}
