import { getOpponent } from './constants';
import { Colors, GameEndState, GameStatus } from './types';

/** Партия завершена (мат, пат или время). */
export function isGameFinished(endState: GameEndState): boolean {
	return (
		endState.kind === 'checkmate' ||
		endState.kind === 'stalemate' ||
		endState.kind === 'timeout'
	);
}

/** Строит GameEndState из внутреннего GameStatus. */
export function endStateFromStatus(status: GameStatus, currentTurn: Colors): GameEndState {
	switch (status) {
		case GameStatus.CHECK:
			return { kind: 'check' };
		case GameStatus.CHECKMATE:
			return { kind: 'checkmate', winner: getOpponent(currentTurn) };
		case GameStatus.STALEMATE:
			return { kind: 'stalemate' };
		default:
			return { kind: 'ongoing' };
	}
}

/** Синхронизирует endState со status (кроме timeout — финальный). */
export function syncEndStateFromStatus(position: {
	status: GameStatus;
	currentTurn: Colors;
	endState: GameEndState;
}): void {
	if (position.endState.kind === 'timeout') return;
	position.endState = endStateFromStatus(position.status, position.currentTurn);
}
