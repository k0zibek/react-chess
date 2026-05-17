import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { FigureNames } from './FigureNames';
import { createFigure } from './figures/FigureFactory';
import { King } from './figures/King';
import { Pawn } from './figures/Pawn';
import { Rook } from './figures/Rook';
import { GameState } from './GameState';
import { Move } from './Move';
import { MoveRecord } from './MoveRecord';

/** Применяет и откатывает ходы на доске. */
export class MoveExecutor {
	static apply(state: GameState, move: Move): MoveRecord {
		const record = this.createRecord(state, move);

		switch (move.type) {
			case 'castle':
				this.applyCastle(state, move, record);
				break;
			case 'enPassant':
				this.applyEnPassant(move, record);
				break;
			case 'promotion':
				this.applyPromotion(move, record);
				break;
			default:
				this.applyNormal(move);
		}

		this.updateCastlingRights(state, move, record);
		this.updateEnPassantTarget(state, move, record);
		return record;
	}

	static undo(state: GameState, record: MoveRecord): void {
		const { move } = record;

		switch (move.type) {
			case 'castle':
				this.undoCastle(move, record);
				break;
			case 'enPassant':
				this.undoEnPassant(state, move, record);
				break;
			case 'promotion':
				this.undoPromotion(state, move, record);
				break;
			default:
				this.undoNormal(state, move, record);
		}

		state.castling = record.castlingBefore.clone();
		state.enPassantTarget = record.enPassantTargetBefore;
	}

	private static createRecord(state: GameState, move: Move): MoveRecord {
		const mover = move.from.figure!;
		return {
			move,
			mover,
			capturedOnTarget: move.type === 'enPassant' ? null : move.to.figure,
			capturedEnPassant: move.type === 'enPassant' ? move.capturedFigure ?? null : null,
			capturedEnPassantCell:
				move.type === 'enPassant' && move.capturedFigure ? move.capturedFigure.cell : null,
			promotedPiece: null,
			enPassantTargetBefore: state.enPassantTarget,
			castlingBefore: state.castling.clone(),
			moverHasMovedBefore: mover.hasMoved,
			rookFrom: null,
			rookTo: null,
			rookHasMovedBefore: false,
			pawnIsFirstStepBefore: mover instanceof Pawn ? mover.isFirstStep : null,
		};
	}

	private static applyNormal(move: Move): void {
		const piece = move.from.figure!;
		if (move.to.figure) {
			move.from.addLostFigure(move.to.figure);
		}
		move.to.setFigure(piece);
		move.from.figure = null;
		piece.moveFigure(move.to);
		if (piece.name === FigureNames.KING || piece.name === FigureNames.ROOK) {
			piece.hasMoved = true;
		}
	}

	private static applyPromotion(move: Move, record: MoveRecord): void {
		const pawn = move.from.figure as Pawn;
		if (move.to.figure) {
			move.from.addLostFigure(move.to.figure);
		}
		move.from.figure = null;
		pawn.isFirstStep = false;
		record.promotedPiece = createFigure(move.promotionPiece!, pawn.color, move.to);
	}

	private static applyEnPassant(move: Move, record: MoveRecord): void {
		const pawn = move.from.figure as Pawn;
		const captured = move.capturedFigure!;
		const capturedCell = captured.cell;
		move.from.addLostFigure(captured);
		capturedCell.figure = null;
		move.to.setFigure(pawn);
		move.from.figure = null;
		pawn.isFirstStep = false;
		record.capturedEnPassantCell = capturedCell;
	}

	private static applyCastle(state: GameState, move: Move, record: MoveRecord): void {
		const king = move.from.figure as King;
		const y = move.from.y;
		const isKingside = move.to.x > move.from.x;
		const rookFrom = state.board.getCell(isKingside ? 7 : 0, y);
		const rookTo = state.board.getCell(isKingside ? 5 : 3, y);
		const rook = rookFrom.figure as Rook;

		record.rookFrom = rookFrom;
		record.rookTo = rookTo;
		record.rookHasMovedBefore = rook.hasMoved;

		move.to.setFigure(king);
		move.from.figure = null;
		king.hasMoved = true;
		rookTo.setFigure(rook);
		rookFrom.figure = null;
		rook.hasMoved = true;
	}

	private static undoNormal(state: GameState, move: Move, record: MoveRecord): void {
		this.restoreMover(move, record);
		if (record.capturedOnTarget) {
			move.to.setFigure(record.capturedOnTarget);
			this.removeFromLost(state, record.capturedOnTarget);
		}
	}

	private static undoPromotion(state: GameState, move: Move, record: MoveRecord): void {
		move.to.figure = null;
		this.restoreMover(move, record);
		if (record.capturedOnTarget) {
			move.to.setFigure(record.capturedOnTarget);
			this.removeFromLost(state, record.capturedOnTarget);
		}
	}

	private static undoEnPassant(state: GameState, move: Move, record: MoveRecord): void {
		this.restoreMover(move, record);
		if (record.capturedEnPassant && record.capturedEnPassantCell) {
			record.capturedEnPassantCell.setFigure(record.capturedEnPassant);
			this.removeFromLost(state, record.capturedEnPassant);
		}
	}

	private static undoCastle(move: Move, record: MoveRecord): void {
		move.from.setFigure(record.mover);
		move.to.figure = null;
		record.mover.hasMoved = record.moverHasMovedBefore;
		if (record.rookFrom && record.rookTo) {
			const rook = record.rookTo.figure;
			if (rook) {
				record.rookFrom.setFigure(rook);
				record.rookTo.figure = null;
				rook.hasMoved = record.rookHasMovedBefore;
			}
		}
	}

	private static restoreMover(move: Move, record: MoveRecord): void {
		move.from.setFigure(record.mover);
		move.to.figure = null;
		record.mover.hasMoved = record.moverHasMovedBefore;
		if (record.mover instanceof Pawn && record.pawnIsFirstStepBefore !== null) {
			record.mover.isFirstStep = record.pawnIsFirstStepBefore;
		}
	}

	private static updateCastlingRights(
		state: GameState,
		move: Move,
		record: MoveRecord,
	): void {
		if (move.type === 'castle' || record.mover.name === FigureNames.KING) {
			state.castling.revokeAll(record.mover.color);
		}
		if (record.capturedOnTarget?.name === FigureNames.ROOK) {
			state.castling.revokeRookSide(
				record.capturedOnTarget.color,
				move.to.x,
				move.to.y,
			);
		}
		if (move.type !== 'castle' && record.mover.name === FigureNames.ROOK) {
			state.castling.revokeRookSide(record.mover.color, move.from.x, move.from.y);
		}
	}

	private static updateEnPassantTarget(
		state: GameState,
		move: Move,
		record: MoveRecord,
	): void {
		if (record.mover.name === FigureNames.PAWN && move.type === 'normal') {
			const dy = Math.abs(move.to.y - move.from.y);
			if (dy === 2) {
				const midY = (move.from.y + move.to.y) / 2;
				state.enPassantTarget = state.board.getCell(move.from.x, midY);
				return;
			}
		}
		state.enPassantTarget = null;
	}

	private static removeFromLost(state: GameState, figure: Figure): void {
		const list =
			figure.color === Colors.BLACK
				? state.board.lostBlackFigures
				: state.board.lostWhiteFigures;
		const index = list.indexOf(figure);
		if (index !== -1) list.splice(index, 1);
	}
}
