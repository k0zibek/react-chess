import { Cell } from './board/Cell';
import { Board } from './board/Board';
import { getOpponent, MAX_UNDO_HISTORY } from './constants';
import { isGameFinished } from './gameEndState';
import { Move } from './Move';
import { applyMove } from './moves/applyMove';
import { Position } from './Position';
import { updateGameStatus } from './rules/gameStatus';
import { getLegalMoves, isLegalMove } from './rules/legalMoves';
import { Colors, GameEndState, GameStatus, LastMove } from './types';

/** Снимок позиции для отображения в UI. */
export interface PositionSnapshot {
	board: Board;
	currentTurn: Colors;
	status: GameStatus;
	endState: GameEndState;
	lastMove: LastMove | null;
}

/** Единая точка входа в шахматную логику. */
export class ChessGame {
	private position: Position;
	private history: Position[] = [];

	constructor(position: Position = Position.createInitial()) {
		this.position = position;
	}

	static createInitial(): ChessGame {
		return new ChessGame();
	}

	getSnapshot(): PositionSnapshot {
		return {
			board: this.position.board,
			currentTurn: this.position.currentTurn,
			status: this.position.status,
			endState: this.position.endState,
			lastMove: this.position.lastMove,
		};
	}

	/** Партия завершена (мат, пат или время). */
	isGameOver(): boolean {
		return isGameFinished(this.position.endState);
	}

	/** Легальные ходы с выбранной клетки. */
	selectLegalMoves(cell: Cell): Move[] {
		if (this.isGameOver()) return [];
		return getLegalMoves(this.position, cell);
	}

	/** Применяет легальный ход и обновляет статус партии. */
	playMove(move: Move): boolean {
		if (this.isGameOver()) return false;
		if (!isLegalMove(this.position, move)) return false;

		this.history.push(this.position.clone());
		if (this.history.length > MAX_UNDO_HISTORY) {
			this.history.shift();
		}
		applyMove(this.position, move);
		this.position.lastMove = {
			from: { x: move.from.x, y: move.from.y },
			to: { x: move.to.x, y: move.to.y },
		};
		this.position.switchTurn();
		updateGameStatus(this.position);
		return true;
	}

	/** Фиксирует победу по истечении времени. */
	declareTimeout(loser: Colors): void {
		if (this.isGameOver()) return;
		this.position.endState = { kind: 'timeout', winner: getOpponent(loser) };
	}

	/** Можно ли отменить последний ход. */
	canUndo(): boolean {
		return this.history.length > 0 && !this.isGameOver();
	}

	/** Откатывает последний ход. */
	undo(): boolean {
		if (!this.canUndo()) return false;

		const previous = this.history.pop();
		if (!previous) return false;

		this.position = previous;
		return true;
	}

	/** Сбрасывает партию в начальную позицию. */
	restart(): void {
		this.history = [];
		this.position = Position.createInitial();
	}
}
