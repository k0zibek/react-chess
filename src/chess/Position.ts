import { Board } from './board/Board';
import { CastlingRights } from './CastlingRights';
import { Cell } from './board/Cell';
import { Colors, GameStatus } from './types';
import { MoveContext } from './MoveContext';

/** Мутабельное состояние позиции: доска, очередь хода и спецправила. */
export class Position implements MoveContext {
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

	static createInitial(): Position {
		const position = new Position();
		position.board.initCells();
		position.board.addFigures();
		return position;
	}

	switchTurn(): void {
		this.currentTurn = this.currentTurn === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
	}
}
