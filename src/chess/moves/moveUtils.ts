import { FigureNames, MoveRecord } from '../types';
import { requireFigure } from '../cellUtils';
import { Move } from '../Move';
import { Pawn } from '../figures/Pawn';
import { Position } from '../Position';

/** Восстанавливает фигуру на исходной клетке при откате. */
export function restoreMover(move: Move, record: MoveRecord): void {
	move.from.setFigure(record.mover);
	move.to.figure = null;
	record.mover.hasMoved = record.moverHasMovedBefore;
	if (record.mover instanceof Pawn && record.pawnIsFirstStepBefore !== null) {
		record.mover.isFirstStep = record.pawnIsFirstStepBefore;
	}
}

/** Создаёт снимок состояния до применения хода. */
export function createMoveRecord(position: Position, move: Move): MoveRecord {
	const mover = requireFigure(move.from);

	return {
		move,
		mover,
		capturedOnTarget: move.type === 'enPassant' ? null : move.to.figure,
		capturedEnPassant: move.type === 'enPassant' ? (move.capturedFigure ?? null) : null,
		capturedEnPassantCell:
			move.type === 'enPassant' && move.capturedFigure ? move.capturedFigure.cell : null,
		promotedPiece: null,
		enPassantTargetBefore: position.enPassantTarget,
		castlingBefore: position.castling.clone(),
		moverHasMovedBefore: mover.hasMoved,
		rookFrom: null,
		rookTo: null,
		rookHasMovedBefore: false,
		pawnIsFirstStepBefore: mover instanceof Pawn ? mover.isFirstStep : null,
	};
}

/** Обновляет права на рокировку после хода. */
export function updateCastlingRights(position: Position, move: Move, record: MoveRecord): void {
	if (move.type === 'castle' || record.mover.name === FigureNames.KING) {
		position.castling.revokeAll(record.mover.color);
	}
	if (record.capturedOnTarget?.name === FigureNames.ROOK) {
		position.castling.revokeRookSide(record.capturedOnTarget.color, move.to.x, move.to.y);
	}
	if (move.type !== 'castle' && record.mover.name === FigureNames.ROOK) {
		position.castling.revokeRookSide(record.mover.color, move.from.x, move.from.y);
	}
}

/** Обновляет цель для взятия на проходе. */
export function updateEnPassantTarget(position: Position, move: Move, record: MoveRecord): void {
	if (record.mover.name === FigureNames.PAWN && move.type === 'normal') {
		const dy = Math.abs(move.to.y - move.from.y);
		if (dy === 2) {
			const midY = (move.from.y + move.to.y) / 2;
			position.enPassantTarget = position.board.getCell(move.from.x, midY);
			return;
		}
	}
	position.enPassantTarget = null;
}
