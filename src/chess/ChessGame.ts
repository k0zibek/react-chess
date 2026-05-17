import { Cell } from './board/Cell';
import { Board } from './board/Board';
import { Move } from './Move';
import { applyMove } from './moves/applyMove';
import { Position } from './Position';
import { updateGameStatus } from './rules/gameStatus';
import { getLegalMoves, isLegalMove } from './rules/legalMoves';
import { Colors, GameStatus } from './types';

/** Снимок позиции для отображения в UI. */
export interface PositionSnapshot {
	board: Board;
	currentTurn: Colors;
	status: GameStatus;
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
		};
	}

	/** Легальные ходы с выбранной клетки. */
	selectLegalMoves(cell: Cell): Move[] {
		return getLegalMoves(this.position, cell);
	}

	/** Применяет легальный ход и обновляет статус партии. */
	playMove(move: Move): boolean {
		if (!isLegalMove(this.position, move)) return false;

		this.history.push(this.position.clone());
		applyMove(this.position, move);
		this.position.switchTurn();
		updateGameStatus(this.position);
		return true;
	}

	/** Можно ли отменить последний ход. */
	canUndo(): boolean {
		return this.history.length > 0;
	}

	/** Откатывает последний ход. */
	undo(): boolean {
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
