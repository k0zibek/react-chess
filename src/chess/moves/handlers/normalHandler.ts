import { requireFigure } from '../../cellUtils';
import { restoreMover } from '../moveUtils';
import { MoveHandler } from './MoveHandler';

/** Обычный ход: перемещение фигуры с возможным взятием. */
export const normalHandler: MoveHandler = {
	apply(position, move) {
		const piece = requireFigure(move.from);

		if (move.to.figure) {
			position.board.captureFigure(move.to.figure);
		}
		move.to.setFigure(piece);
		move.from.figure = null;
		piece.onMoved();
	},

	undo(position, move, record) {
		restoreMover(move, record);
		if (record.capturedOnTarget) {
			move.to.setFigure(record.capturedOnTarget);
			position.board.restoreCapturedFigure(record.capturedOnTarget);
		}
	},
};
