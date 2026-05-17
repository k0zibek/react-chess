import { Colors } from '../Colors';
import logo from '../../assets/white-king.png';
import { Cell } from '../Cell';
import { GameState } from '../GameState';
import { FigureNames } from '../FigureNames';
import { Move } from '../Move';

export { FigureNames } from '../FigureNames';

/** Базовый класс шахматной фигуры. */
export class Figure {
	color: Colors;
	logo: typeof logo | null;
	cell: Cell;
	name: FigureNames;
	id: number;
	hasMoved = false;

	constructor(color: Colors, cell: Cell) {
		this.color = color;
		this.cell = cell;
		this.cell.figure = this;
		this.logo = null;
		this.name = FigureNames.FIGURE;
		this.id = Math.random();
	}

	/** Псевдо-легальные ходы без учёта шаха своему королю. */
	getPseudoLegalMoves(state: GameState): Move[] {
		void state;
		return [];
	}

	/** Можно ли взять фигуру на занятой клетке (не своих и не короля). */
	protected canTargetCell(target: Cell): boolean {
		if (target.isEmpty()) return false;
		if (target.figure?.color === this.color) return false;
		if (target.figure?.name === FigureNames.KING) return false;
		return true;
	}

	/** Бьёт ли фигура указанную клетку (для проверки атаки). */
	canAttackSquare(target: Cell): boolean {
		void target;
		return false;
	}

	moveFigure(target: Cell) {
		void target;
	}
}
