import { Board } from '../board/Board';
import { forEachCell } from '../board/boardUtils';
import { Cell } from '../board/Cell';
import { getOpponent } from '../constants';
import { Colors, FigureNames } from '../types';

/** Проверяет, атакована ли клетка фигурами указанного цвета. */
export function isSquareAttacked(
	board: Board,
	x: number,
	y: number,
	byColor: Colors,
): boolean {
	const target = board.getCell(x, y);
	let attacked = false;
	forEachCell(board, (cell) => {
		if (attacked) return;
		const figure = cell.figure;
		if (figure && figure.color === byColor && figure.canAttackSquare(target)) {
			attacked = true;
		}
	});
	return attacked;
}

/** Находит клетку короля заданного цвета. */
export function findKing(board: Board, color: Colors): Cell | null {
	let kingCell: Cell | null = null;
	forEachCell(board, (cell) => {
		if (cell.figure?.name === FigureNames.KING && cell.figure.color === color) {
			kingCell = cell;
		}
	});
	return kingCell;
}

/** Проверяет, находится ли король под шахом. */
export function isKingInCheck(board: Board, color: Colors): boolean {
	const kingCell = findKing(board, color);
	if (!kingCell) return false;
	return isSquareAttacked(board, kingCell.x, kingCell.y, getOpponent(color));
}
