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

	canMove(target: Cell): boolean {
		if (!super.canMove(target)) return false;
		// Проверка, что король может двигаться только на одну клетку в любом направлении
		const dx = Math.abs(target.x - this.cell.x);
		const dy = Math.abs(target.y - this.cell.y);

		// Король может двигаться на одну клетку в любом направлении
		return dx <= 1 && dy <= 1;
	}
}
