import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { updateGameStatus } from '../rules/gameStatus';
import { Colors, FigureNames, GameStatus } from '../types';
import { createEmptyPosition, placePiece, setTurn } from './testUtils';

describe('gameStatus', () => {
	it('определяет шах', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		updateGameStatus(position);
		expect(position.status).toBe(GameStatus.CHECK);
	});

	it('определяет мат', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 2, 5);
		placePiece(position, FigureNames.QUEEN, Colors.BLACK, 1, 6);
		setTurn(position, Colors.WHITE);

		updateGameStatus(position);
		expect(position.status).toBe(GameStatus.CHECKMATE);
	});

	it('определяет пат', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 5, 3);
		placePiece(position, FigureNames.QUEEN, Colors.BLACK, 6, 5);
		setTurn(position, Colors.WHITE);

		updateGameStatus(position);
		expect(position.status).toBe(GameStatus.STALEMATE);
	});

	it('обновляет статус после хода через ChessGame', () => {
		const game = ChessGame.createInitial();
		const position = game.getSnapshot();
		const whitePawn = position.board.getCell(4, 6);
		const moves = game.selectLegalMoves(whitePawn);
		expect(moves.length).toBeGreaterThan(0);
		expect(game.playMove(moves[0])).toBe(true);
		expect(game.getSnapshot().status).toBe(GameStatus.ONGOING);
	});
});
