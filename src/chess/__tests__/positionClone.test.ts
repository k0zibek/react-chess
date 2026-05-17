import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { Position } from '../Position';
import { boardsMatch, clonePosition } from '../positionClone';
import { Colors, FigureNames, GameStatus } from '../types';
import { createEmptyPosition, placePiece, setTurn } from './testUtils';

describe('positionClone', () => {
	it('клонирует начальную позицию', () => {
		const source = Position.createInitial();
		const clone = clonePosition(source);

		expect(boardsMatch(source.board, clone.board)).toBe(true);
		expect(clone.currentTurn).toBe(source.currentTurn);
		expect(clone.status).toBe(source.status);
		expect(clone.castling.whiteKingside).toBe(true);
	});

	it('клонирует позицию после взятия', () => {
		const source = createEmptyPosition();
		placePiece(source, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(source, FigureNames.KING, Colors.BLACK, 0, 0);
		placePiece(source, FigureNames.ROOK, Colors.WHITE, 0, 7);
		placePiece(source, FigureNames.ROOK, Colors.BLACK, 0, 0);
		setTurn(source, Colors.WHITE);

		const game = new ChessGame(source);
		const rookCell = source.board.getCell(0, 7);
		const capture = game.selectLegalMoves(rookCell).find((move) => move.to.x === 0);
		game.playMove(capture!);

		const clone = clonePosition(source);
		expect(boardsMatch(source.board, clone.board)).toBe(true);
		expect(source.board.lostBlackFigures.length).toBe(clone.board.lostBlackFigures.length);
	});

	it('Position.clone() возвращает независимую копию', () => {
		const source = Position.createInitial();
		const clone = source.clone();

		clone.board.getCell(4, 6).figure = null;
		expect(source.board.getCell(4, 6).figure).not.toBeNull();
	});
});

describe('ChessGame undo', () => {
	it('отменяет последний ход', () => {
		const game = ChessGame.createInitial();
		const pawnCell = game.getSnapshot().board.getCell(4, 6);
		const move = game.selectLegalMoves(pawnCell)[0];

		expect(game.playMove(move)).toBe(true);
		expect(game.getSnapshot().board.getCell(4, 6).figure).toBeNull();

		expect(game.undo()).toBe(true);
		expect(game.getSnapshot().board.getCell(4, 6).figure?.name).toBe(FigureNames.PAWN);
	});

	it('canUndo возвращает false в начальной позиции', () => {
		const game = ChessGame.createInitial();
		expect(game.canUndo()).toBe(false);
		expect(game.undo()).toBe(false);
	});

	it('restart очищает историю ходов', () => {
		const game = ChessGame.createInitial();
		const pawnCell = game.getSnapshot().board.getCell(4, 6);
		game.playMove(game.selectLegalMoves(pawnCell)[0]);

		game.restart();
		expect(game.canUndo()).toBe(false);
		expect(game.getSnapshot().status).toBe(GameStatus.ONGOING);
	});
});
