import { forEachCell } from '../board/boardUtils';
import { Cell } from '../board/Cell';
import { getOpponent } from '../constants';
import { MoveContext } from '../MoveContext';
import { Move } from '../Move';
import { applyMove, undoMove } from '../moves/applyMove';
import type { Position } from '../Position';
import { Colors } from '../types';
import { isKingInCheck, isSquareAttacked } from './attack';

/** Псевдо-легальные ходы фигуры на клетке. */
export function getPseudoLegalMoves(ctx: MoveContext, cell: Cell): Move[] {
	return cell.figure?.getPseudoLegalMoves(ctx) ?? [];
}

/** Проверяет легальность рокировки (король не проходит под шахом). */
function isCastlingMoveLegal(position: Position, move: Move, color: Colors): boolean {
	if (move.type !== 'castle') return true;
	if (isKingInCheck(position.board, color)) return false;

	const attacker = getOpponent(color);
	const dx = move.to.x - move.from.x;
	const step = dx > 0 ? 1 : -1;

	for (let x = move.from.x; x !== move.to.x + step; x += step) {
		if (x !== move.from.x && isSquareAttacked(position.board, x, move.from.y, attacker)) {
			return false;
		}
	}
	return true;
}

/** Легальные ходы с клетки с учётом шаха. */
export function getLegalMoves(position: Position, cell: Cell, forColor?: Colors): Move[] {
	const color = forColor ?? position.currentTurn;
	if (!cell.figure || cell.figure.color !== color) return [];

	const moverColor = cell.figure.color;
	return getPseudoLegalMoves(position, cell).filter((move) => {
		if (!isCastlingMoveLegal(position, move, moverColor)) return false;
		const record = applyMove(position, move);
		const legal = !isKingInCheck(position.board, moverColor);
		undoMove(position, record);
		return legal;
	});
}

/** Все легальные ходы стороны. */
export function getAllLegalMoves(position: Position, color: Colors): Move[] {
	const moves: Move[] = [];
	forEachCell(position.board, (cell) => {
		if (cell.figure?.color === color) {
			moves.push(...getLegalMoves(position, cell, color));
		}
	});
	return moves;
}

/** Проверяет, входит ли ход в список легальных. */
export function isLegalMove(position: Position, move: Move): boolean {
	return getLegalMoves(position, move.from).some((legal) => legal.matches(move));
}
