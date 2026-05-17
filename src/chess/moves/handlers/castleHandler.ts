import { King } from '../../figures/King';
import { Rook } from '../../figures/Rook';
import { MoveHandler } from './MoveHandler';

/** Рокировка: король и ладья перемещаются одновременно. */
export const castleHandler: MoveHandler = {
	apply(position, move, record) {
		const king = move.from.figure;
		if (!(king instanceof King)) return;

		const y = move.from.y;
		const isKingside = move.to.x > move.from.x;
		const rookFrom = position.board.getCell(isKingside ? 7 : 0, y);
		const rookTo = position.board.getCell(isKingside ? 5 : 3, y);
		const rook = rookFrom.figure;
		if (!(rook instanceof Rook)) return;

		record.rookFrom = rookFrom;
		record.rookTo = rookTo;
		record.rookHasMovedBefore = rook.hasMoved;

		move.to.setFigure(king);
		move.from.figure = null;
		king.hasMoved = true;
		rookTo.setFigure(rook);
		rookFrom.figure = null;
		rook.hasMoved = true;
	},

	undo(_position, move, record) {
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
	},
};
