export enum Colors {
	WHITE = 'white',
	BLACK = 'black',
}

/** Типы шахматных фигур. */
export enum FigureNames {
	FIGURE = 'Фигура',
	KING = 'Король',
	KNIGHT = 'Конь',
	PAWN = 'Пешка',
	QUEEN = 'Ферзь',
	ROOK = 'Ладья',
	BISHOP = 'Слон',
}

/** Статус партии после проверки правил. */
export enum GameStatus {
	ONGOING = 'ongoing',
	CHECK = 'check',
	CHECKMATE = 'checkmate',
	STALEMATE = 'stalemate',
}

export type MoveType = 'normal' | 'castle' | 'enPassant' | 'promotion';

/** Координаты клетки на доске. */
export interface BoardSquare {
	x: number;
	y: number;
}

/** Подсветка последнего хода в UI. */
export interface LastMove {
	from: BoardSquare;
	to: BoardSquare;
}

/** Единое состояние конца партии для UI и домена. */
export type GameEndState =
	| { kind: 'ongoing' }
	| { kind: 'check' }
	| { kind: 'checkmate'; winner: Colors }
	| { kind: 'stalemate' }
	| { kind: 'timeout'; winner: Colors };

import type { CastlingRights } from './CastlingRights';
import type { Cell } from './board/Cell';
import type { Figure } from './figures/Figure';
import type { Move } from './Move';

/** Снимок состояния для отката хода при проверке легальности. */
export interface MoveRecord {
	move: Move;
	mover: Figure;
	capturedOnTarget: Figure | null;
	capturedEnPassant: Figure | null;
	capturedEnPassantCell: Cell | null;
	promotedPiece: Figure | null;
	enPassantTargetBefore: Cell | null;
	castlingBefore: CastlingRights;
	moverHasMovedBefore: boolean;
	rookFrom: Cell | null;
	rookTo: Cell | null;
	rookHasMovedBefore: boolean;
	pawnIsFirstStepBefore: boolean | null;
}
