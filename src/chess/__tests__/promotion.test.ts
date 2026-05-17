import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { getLegalMoves } from '../rules/legalMoves';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, hasMove, markPawnMoved, placePiece, setTurn } from './testUtils';

describe('promotion', () => {
	it('генерирует четыре варианта превращения', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 1);
		markPawnMoved(position, 4, 1);
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		setTurn(position, Colors.WHITE);

		const pawnCell = position.board.getCell(4, 1);
		const moves = getLegalMoves(position, pawnCell);
		expect(hasMove(moves, 4, 1, 4, 0, 'promotion', FigureNames.QUEEN)).toBe(true);
		expect(hasMove(moves, 4, 1, 4, 0, 'promotion', FigureNames.ROOK)).toBe(true);
		expect(hasMove(moves, 4, 1, 4, 0, 'promotion', FigureNames.BISHOP)).toBe(true);
		expect(hasMove(moves, 4, 1, 4, 0, 'promotion', FigureNames.KNIGHT)).toBe(true);
	});

	it('превращает пешку в выбранную фигуру', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 1);
		markPawnMoved(position, 4, 1);
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		setTurn(position, Colors.WHITE);

		const game = new ChessGame(position);
		const pawnCell = position.board.getCell(4, 1);
		const queenPromotion = game
			.selectLegalMoves(pawnCell)
			.find((move) => move.promotionPiece === FigureNames.QUEEN);

		expect(queenPromotion).toBeDefined();
		expect(game.playMove(queenPromotion!)).toBe(true);
		expect(position.board.getCell(4, 0).figure?.name).toBe(FigureNames.QUEEN);
	});
});
