import { Board } from './board/Board';
import { forEachCell } from './board/boardUtils';
import { createFigure } from './figures/createFigure';
import { Figure } from './figures/Figure';
import { Pawn } from './figures/Pawn';
import { Position } from './Position';
import { FigureNames } from './types';

/** Копирует состояние движения фигуры. */
function copyFigureState(target: Figure, source: Figure): void {
	target.hasMoved = source.hasMoved;
	if (target instanceof Pawn && source instanceof Pawn) {
		target.isFirstStep = source.isFirstStep;
	}
}

/** Клонирует фигуру для списка съеденных (без привязки к игровой доске). */
function cloneLostFigure(source: Figure, spareBoard: Board): Figure {
	const spareCell = spareBoard.getCell(0, 0);
	const copy = createFigure(source.name, source.color, spareCell);
	spareCell.figure = null;
	copyFigureState(copy, source);
	return copy;
}

/** Глубокое копирование позиции для undo и анализа. */
export function clonePosition(source: Position): Position {
	const clone = new Position();
	clone.board.initCells();
	clone.currentTurn = source.currentTurn;
	clone.status = source.status;
	clone.castling = source.castling.clone();

	forEachCell(source.board, (cell) => {
		const figure = cell.figure;
		if (!figure) return;

		const targetCell = clone.board.getCell(cell.x, cell.y);
		const copy = createFigure(figure.name, figure.color, targetCell);
		copyFigureState(copy, figure);
	});

	if (source.enPassantTarget) {
		clone.enPassantTarget = clone.board.getCell(
			source.enPassantTarget.x,
			source.enPassantTarget.y,
		);
	}

	const spareBoard = new Board();
	spareBoard.initCells();

	clone.board.lostBlackFigures = source.board.lostBlackFigures.map((figure) =>
		cloneLostFigure(figure, spareBoard),
	);
	clone.board.lostWhiteFigures = source.board.lostWhiteFigures.map((figure) =>
		cloneLostFigure(figure, spareBoard),
	);

	return clone;
}

/** Сравнивает размещение фигур на двух досках. */
export function boardsMatch(left: Board, right: Board): boolean {
	let matches = true;
	forEachCell(left, (cell, x, y) => {
		if (!matches) return;
		const other = right.getCell(x, y);
		const figure = cell.figure;
		const otherFigure = other.figure;

		if (!figure && !otherFigure) return;
		if (!figure || !otherFigure) {
			matches = false;
			return;
		}
		if (figure.name !== otherFigure.name || figure.color !== otherFigure.color) {
			matches = false;
		}
	});
	return matches;
}

/** Возвращает имя фигуры на клетке для сравнения в тестах. */
export function getPieceAt(board: Board, x: number, y: number): FigureNames | null {
	return board.getCell(x, y).figure?.name ?? null;
}
