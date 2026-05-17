import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { endStateFromStatus, isGameFinished, syncEndStateFromStatus } from '../gameEndState';
import { Colors, FigureNames, GameStatus } from '../types';
import { createEmptyPosition, placePiece, setTurn } from './testUtils';
import { updateGameStatus } from '../rules/gameStatus';

describe('gameEndState', () => {
	it('isGameFinished для мат, пат и timeout', () => {
		expect(isGameFinished({ kind: 'ongoing' })).toBe(false);
		expect(isGameFinished({ kind: 'check' })).toBe(false);
		expect(isGameFinished({ kind: 'checkmate', winner: Colors.WHITE })).toBe(true);
		expect(isGameFinished({ kind: 'stalemate' })).toBe(true);
		expect(isGameFinished({ kind: 'timeout', winner: Colors.BLACK })).toBe(true);
	});

	it('endStateFromStatus отражает GameStatus', () => {
		expect(endStateFromStatus(GameStatus.ONGOING, Colors.WHITE)).toEqual({ kind: 'ongoing' });
		expect(endStateFromStatus(GameStatus.CHECK, Colors.WHITE)).toEqual({ kind: 'check' });
		expect(endStateFromStatus(GameStatus.CHECKMATE, Colors.WHITE)).toEqual({
			kind: 'checkmate',
			winner: Colors.BLACK,
		});
		expect(endStateFromStatus(GameStatus.STALEMATE, Colors.BLACK)).toEqual({ kind: 'stalemate' });
	});

	it('syncEndStateFromStatus не перезаписывает timeout', () => {
		const position = createEmptyPosition();
		position.endState = { kind: 'timeout', winner: Colors.WHITE };
		position.status = GameStatus.ONGOING;

		syncEndStateFromStatus(position);
		expect(position.endState).toEqual({ kind: 'timeout', winner: Colors.WHITE });
	});

	it('updateGameStatus синхронизирует endState', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		updateGameStatus(position);
		expect(position.endState).toEqual({ kind: 'check' });
	});
});

describe('ChessGame game over', () => {
	it('declareTimeout завершает партию', () => {
		const game = ChessGame.createInitial();
		expect(game.isGameOver()).toBe(false);

		game.declareTimeout(Colors.WHITE);
		const snapshot = game.getSnapshot();

		expect(game.isGameOver()).toBe(true);
		expect(snapshot.endState).toEqual({ kind: 'timeout', winner: Colors.BLACK });
		expect(game.selectLegalMoves(snapshot.board.getCell(4, 6))).toHaveLength(0);
	});

	it('canUndo блокируется после завершения партии', () => {
		const game = ChessGame.createInitial();
		const pawnCell = game.getSnapshot().board.getCell(4, 6);
		const move = game.selectLegalMoves(pawnCell)[0];
		expect(move).toBeDefined();
		if (move) game.playMove(move);
		expect(game.canUndo()).toBe(true);

		game.declareTimeout(Colors.BLACK);
		expect(game.canUndo()).toBe(false);
	});

	it('restart сбрасывает endState после timeout', () => {
		const game = ChessGame.createInitial();
		game.declareTimeout(Colors.WHITE);

		expect(game.isGameOver()).toBe(true);
		expect(game.getSnapshot().endState).toEqual({ kind: 'timeout', winner: Colors.BLACK });

		game.restart();

		expect(game.isGameOver()).toBe(false);
		expect(game.getSnapshot().endState).toEqual({ kind: 'ongoing' });
		expect(game.getSnapshot().status).toBe(GameStatus.ONGOING);
	});
});
