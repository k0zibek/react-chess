import { CastlingRights } from './CastlingRights';
import { Cell } from './Cell';
import { Figure } from './figures/Figure';
import { Move } from './Move';

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
