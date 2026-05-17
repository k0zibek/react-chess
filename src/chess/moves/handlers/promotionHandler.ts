import { FigureNames } from '../../types';
import { requireFigure } from '../../cellUtils';
import { createFigure } from '../../figures/createFigure';
import { restoreMover } from '../moveUtils';
import { MoveHandler } from './MoveHandler';

/** Превращение пешки в выбранную фигуру. */
export const promotionHandler: MoveHandler = {
	apply(position, move, record) {
		const pawn = requireFigure(move.from);
		if (pawn.name !== FigureNames.PAWN || !move.promotionPiece) return;

		if (move.to.figure) {
			position.board.captureFigure(move.to.figure);
		}
		move.from.figure = null;
		pawn.onMoved();
		record.promotedPiece = createFigure(move.promotionPiece, pawn.color, move.to);
	},

	undo(position, move, record) {
		move.to.figure = null;
		restoreMover(move, record);
		if (record.capturedOnTarget) {
			move.to.setFigure(record.capturedOnTarget);
			position.board.restoreCapturedFigure(record.capturedOnTarget);
		}
	},
};
