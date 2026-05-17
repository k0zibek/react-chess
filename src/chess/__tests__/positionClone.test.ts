import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { Position } from '../Position';
import { boardsMatch, clonePosition } from '../positionClone';
import { Colors, FigureNames, GameStatus } from '../types';
import { MAX_UNDO_HISTORY } from '../constants';
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

	it('отменяет несколько ходов подряд', () => {
		const game = ChessGame.createInitial();

		game.playMove(game.selectLegalMoves(game.getSnapshot().board.getCell(4, 6))[0]);
		game.playMove(game.selectLegalMoves(game.getSnapshot().board.getCell(1, 0))[0]);

		expect(game.undo()).toBe(true);
		expect(game.getSnapshot().board.getCell(1, 0).figure?.name).toBe(FigureNames.KNIGHT);
		expect(game.undo()).toBe(true);
		expect(game.getSnapshot().board.getCell(4, 6).figure?.name).toBe(FigureNames.PAWN);
	});

	it('восстанавливает съеденную фигуру при undo', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 0, 7);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 0, 0);
		setTurn(position, Colors.WHITE);

		const game = new ChessGame(position);
		const capture = game
			.selectLegalMoves(position.board.getCell(0, 7))
			.find((move) => move.to.x === 0 && move.to.y === 0);

		expect(capture).toBeDefined();
		game.playMove(capture!);
		expect(game.getSnapshot().board.lostBlackFigures).toHaveLength(1);
		expect(game.canUndo()).toBe(true);

		game.undo();
		const board = game.getSnapshot().board;
		expect(board.getCell(0, 0).figure?.name).toBe(FigureNames.ROOK);
		expect(board.lostBlackFigures).toHaveLength(0);
	});

	it('ограничивает глубину истории undo', () => {
		const game = ChessGame.createInitial();
		let playedMoves = 0;

		for (let i = 0; i < MAX_UNDO_HISTORY + 10; i++) {
			const snapshot = game.getSnapshot();
			const board = snapshot.board;
			let played = false;

			for (let y = 0; y < 8 && !played; y++) {
				for (let x = 0; x < 8 && !played; x++) {
					const cell = board.getCell(x, y);
					if (cell.figure?.color !== snapshot.currentTurn) continue;
					const legal = game.selectLegalMoves(cell);
					if (legal.length > 0) {
						played = game.playMove(legal[0]);
						if (played) playedMoves++;
					}
				}
			}

			if (!played) break;
		}

		let undoCount = 0;
		while (game.undo()) undoCount++;

		expect(playedMoves).toBeGreaterThan(MAX_UNDO_HISTORY);
		expect(undoCount).toBe(MAX_UNDO_HISTORY);
	});
});
