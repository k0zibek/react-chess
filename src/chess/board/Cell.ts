import { Board } from './Board';
import { Colors } from '../types';
import { Figure } from '../figures/Figure';

/** Клетка доски: координаты, цвет поля и фигура. */
export class Cell {
	readonly x: number;
	readonly y: number;
	readonly color: Colors;
	figure: Figure | null;
	board: Board;

	constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
		this.x = x;
		this.y = y;
		this.board = board;
		this.color = color;
		this.figure = figure;
	}

	isEmpty(): boolean {
		return this.figure === null;
	}

	isEnemy(target: Cell): boolean {
		if (!target.figure || !this.figure) return false;
		return this.figure.color !== target.figure.color;
	}

	setFigure(figure: Figure) {
		this.figure = figure;
		this.figure.cell = this;
	}
}
