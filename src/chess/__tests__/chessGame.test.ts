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
});
