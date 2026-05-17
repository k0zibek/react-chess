import { Board } from './Board';
import { CastlingRights } from './CastlingRights';
import { Cell } from './Cell';
import { Colors } from './Colors';
import { GameStatus } from './GameStatus';
import { Move } from './Move';
import { MoveExecutor } from './MoveExecutor';
import { MoveRecord } from './MoveRecord';
import { RulesEngine } from './RulesEngine';

/** Агрегат состояния партии: доска, очередь хода и спецправила. */
export class GameState {
	board: Board;
	currentTurn: Colors;
	castling: CastlingRights;
	enPassantTarget: Cell | null;
	status: GameStatus;

	constructor() {
		this.board = new Board();
		this.currentTurn = Colors.WHITE;
		this.castling = new CastlingRights();
		this.enPassantTarget = null;
		this.status = GameStatus.ONGOING;
	}

	static createInitial(): GameState {
		const state = new GameState();
		state.board.initCells();
		state.board.addFigures();
		return state;
	}

	/** Новая оболочка GameState для триггера React re-render. */
	cloneBoardShell(): GameState {
		const shell = new GameState();
		shell.board = this.board.cloneBoardShell();
		shell.currentTurn = this.currentTurn;
		shell.castling = this.castling.clone();
		shell.enPassantTarget = this.enPassantTarget;
		shell.status = this.status;
		return shell;
	}

	switchTurn(): void {
		this.currentTurn = this.currentTurn === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
	}

	applyMove(move: Move): MoveRecord {
		return MoveExecutor.apply(this, move);
	}

	undoMove(record: MoveRecord): void {
		MoveExecutor.undo(this, record);
	}

	/** Применяет легальный ход, переключает очередь и обновляет статус партии. */
	playTurn(move: Move): boolean {
		if (!RulesEngine.isLegalMove(this, move)) return false;
		this.applyMove(move);
		this.switchTurn();
		RulesEngine.updateGameStatus(this);
		return true;
	}
}
