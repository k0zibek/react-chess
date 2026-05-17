import { Board } from './board/Board';
import { CastlingRights } from './CastlingRights';
import { Cell } from './board/Cell';

/** Контекст для генерации ходов фигур без знания о полном состоянии партии. */
export interface MoveContext {
	board: Board;
	castling: CastlingRights;
	enPassantTarget: Cell | null;
}
