import { Cell } from '../board/Cell';
import { Move } from '../Move';
import { MoveContext } from '../MoveContext';
import { Colors, FigureNames } from '../types';
import { getFigureLogo } from './figureAssets';

/** Базовый класс шахматной фигуры. */
export abstract class Figure {
	color: Colors;
	logo: string | null;
	cell: Cell;
	name: FigureNames;
	hasMoved = false;

	constructor(color: Colors, cell: Cell, name: FigureNames) {
		this.color = color;
		this.cell = cell;
		this.cell.figure = this;
		this.name = name;
		this.logo = getFigureLogo(name, color);
	}

	/** Псевдо-легальные ходы без учёта шаха своему королю. */
	abstract getPseudoLegalMoves(ctx: MoveContext): Move[];

	/** Бьёт ли фигура указанную клетку (для проверки атаки). */
	abstract canAttackSquare(target: Cell): boolean;

	/** Можно ли взять фигуру на занятой клетке (не своих и не короля). */
	protected canTargetCell(target: Cell): boolean {
		if (target.isEmpty()) return false;
		if (target.figure?.color === this.color) return false;
		if (target.figure?.name === FigureNames.KING) return false;
		return true;
	}
}
