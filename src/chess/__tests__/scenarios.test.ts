import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { getLegalMoves } from '../rules/legalMoves';
import { updateGameStatus } from '../rules/gameStatus';
import { Colors, FigureNames, GameStatus } from '../types';
import { createEmptyPosition, placePiece, setTurn } from './testUtils';

describe('критические позиции', () => {
	it('находит мат в один ход', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 2, 5);
		placePiece(position, FigureNames.QUEEN, Colors.BLACK, 1, 5);
		setTurn(position, Colors.BLACK);

		const game = new ChessGame(position);
		const queenCell = position.board.getCell(1, 5);
		const mateMove = game.selectLegalMoves(queenCell).find(
			(move) => move.to.x === 1 && move.to.y === 6,
		);

		expect(mateMove).toBeDefined();
		expect(game.playMove(mateMove!)).toBe(true);
		expect(game.getSnapshot().status).toBe(GameStatus.CHECKMATE);
	});

	it('определяет шах перед матом', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		updateGameStatus(position);
		expect(position.status).toBe(GameStatus.CHECK);
	});

	it('запрещает рокировку, если король под шахом', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(moves.some((move) => move.type === 'castle')).toBe(false);
	});
});
