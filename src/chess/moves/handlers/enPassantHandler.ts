import { FigureNames } from '../../types';
import { requireFigure } from '../../cellUtils';
import { restoreMover } from '../moveUtils';
import { MoveHandler } from './MoveHandler';

/** Взятие на проходе. */
export const enPassantHandler: MoveHandler = {
	apply(position, move, record) {
		const pawn = requireFigure(move.from);
		const captured = move.capturedFigure;
		if (pawn.name !== FigureNames.PAWN || !captured) return;

		const capturedCell = captured.cell;
		position.board.captureFigure(captured);
		capturedCell.figure = null;
		move.to.setFigure(pawn);
		move.from.figure = null;
		pawn.onMoved();
		record.capturedEnPassantCell = capturedCell;
	},

	undo(position, move, record) {
		restoreMover(move, record);
		if (record.capturedEnPassant && record.capturedEnPassantCell) {
			record.capturedEnPassantCell.setFigure(record.capturedEnPassant);
			position.board.restoreCapturedFigure(record.capturedEnPassant);
		}
	},
};
