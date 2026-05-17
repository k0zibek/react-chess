import { FigureNames } from '../../types';
import { requireFigure } from '../../cellUtils';
import { MoveHandler } from './MoveHandler';

/** Рокировка: король и ладья перемещаются одновременно. */
export const castleHandler: MoveHandler = {
	apply(position, move, record) {
		const king = requireFigure(move.from);
		if (king.name !== FigureNames.KING) return;

		const y = move.from.y;
		const isKingside = move.to.x > move.from.x;
		const rookFrom = position.board.getCell(isKingside ? 7 : 0, y);
		const rookTo = position.board.getCell(isKingside ? 5 : 3, y);
		const rook = rookFrom.figure;
		if (!rook || rook.name !== FigureNames.ROOK) return;

		record.rookFrom = rookFrom;
		record.rookTo = rookTo;
		record.rookHasMovedBefore = rook.hasMoved;

		move.to.setFigure(king);
		move.from.figure = null;
		king.onMoved();
		rookTo.setFigure(rook);
		rookFrom.figure = null;
		rook.onMoved();
	},

	undo(_position, move, record) {
		move.from.setFigure(record.mover);
		move.to.figure = null;
		record.mover.restoreMoveState(record.moverHasMovedBefore, record.pawnIsFirstStepBefore);
		if (record.rookFrom && record.rookTo) {
			const rook = record.rookTo.figure;
			if (rook) {
				record.rookFrom.setFigure(rook);
				record.rookTo.figure = null;
				rook.restoreMoveState(record.rookHasMovedBefore, null);
			}
		}
	},
};
