import type { Position } from '../Position';
import { GameStatus } from '../types';
import { isKingInCheck } from './attack';
import { getAllLegalMoves } from './legalMoves';

/** Обновляет статус партии: шах, мат или пат. */
export function updateGameStatus(position: Position): void {
	if (position.status === GameStatus.CHECKMATE || position.status === GameStatus.STALEMATE) {
		return;
	}

	const inCheck = isKingInCheck(position.board, position.currentTurn);
	const legalMoves = getAllLegalMoves(position, position.currentTurn);

	if (legalMoves.length === 0) {
		position.status = inCheck ? GameStatus.CHECKMATE : GameStatus.STALEMATE;
	} else if (inCheck) {
		position.status = GameStatus.CHECK;
	} else {
		position.status = GameStatus.ONGOING;
	}
}
