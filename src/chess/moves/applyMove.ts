import { Position } from '../Position';
import { Move } from '../Move';
import { MoveRecord } from '../types';
import { moveHandlers } from './moveHandlers';
import { createMoveRecord, updateCastlingRights, updateEnPassantTarget } from './moveUtils';

/** Применяет ход на доске и возвращает снимок для отката. */
export function applyMove(position: Position, move: Move): MoveRecord {
	const record = createMoveRecord(position, move);
	moveHandlers[move.type].apply(position, move, record);
	updateCastlingRights(position, move, record);
	updateEnPassantTarget(position, move, record);
	return record;
}

/** Откатывает ход по сохранённому снимку. */
export function undoMove(position: Position, record: MoveRecord): void {
	const { move } = record;
	moveHandlers[move.type].undo(position, move, record);
	position.castling = record.castlingBefore.clone();
	position.enPassantTarget = record.enPassantTargetBefore;
}
