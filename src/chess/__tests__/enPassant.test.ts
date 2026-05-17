import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { getLegalMoves } from '../rules/legalMoves';
import { Colors, FigureNames } from '../types';
import {
	createEmptyPosition,
	hasMove,
	placePiece,
	setEnPassantTarget,
	setTurn,
} from './testUtils';

describe('en passant', () => {
	it('предлагает взятие на проходе', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 3);
		placePiece(position, FigureNames.PAWN, Colors.BLACK, 3, 3);
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		setEnPassantTarget(position, 3, 2);
		setTurn(position, Colors.WHITE);

		const pawnCell = position.board.getCell(4, 3);
		const moves = getLegalMoves(position, pawnCell);
		expect(hasMove(moves, 4, 3, 3, 2, 'enPassant')).toBe(true);
	});

	it('применяет взятие на проходе через ChessGame', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 3);
		placePiece(position, FigureNames.PAWN, Colors.BLACK, 3, 3);
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		setEnPassantTarget(position, 3, 2);
		setTurn(position, Colors.WHITE);

		const game = new ChessGame(position);
		const pawnCell = position.board.getCell(4, 3);
		const moves = game.selectLegalMoves(pawnCell);
		const enPassant = moves.find((move) => move.type === 'enPassant');
		expect(enPassant).toBeDefined();

		expect(game.playMove(enPassant!)).toBe(true);
		expect(position.board.getCell(3, 2).figure?.color).toBe(Colors.WHITE);
		expect(position.board.getCell(3, 3).figure).toBeNull();
	});
});
