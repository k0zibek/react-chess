import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, placePiece, setTurn } from './testUtils';

describe('ChessGame playMove', () => {
	it('выполняет короткую рокировку белых', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const game = new ChessGame(position);
		const kingCell = position.board.getCell(4, 7);
		const castle = game.selectLegalMoves(kingCell).find((move) => move.type === 'castle');

		expect(castle).toBeDefined();
		expect(game.playMove(castle!)).toBe(true);
		expect(position.board.getCell(6, 7).figure?.name).toBe(FigureNames.KING);
		expect(position.board.getCell(5, 7).figure?.name).toBe(FigureNames.ROOK);
		expect(position.board.getCell(4, 7).figure).toBeNull();
	});

	it('сохраняет lastMove в snapshot после хода', () => {
		const game = ChessGame.createInitial();
		const pawnCell = game.getSnapshot().board.getCell(4, 6);
		const move = game.selectLegalMoves(pawnCell)[0];

		game.playMove(move);

		expect(game.getSnapshot().lastMove).toEqual({
			from: { x: move.from.x, y: move.from.y },
			to: { x: move.to.x, y: move.to.y },
		});
	});

	it('сбрасывает lastMove при restart', () => {
		const game = ChessGame.createInitial();
		const pawnCell = game.getSnapshot().board.getCell(4, 6);
		game.playMove(game.selectLegalMoves(pawnCell)[0]);

		game.restart();

		expect(game.getSnapshot().lastMove).toBeNull();
	});
});
