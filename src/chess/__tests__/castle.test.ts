import { describe, expect, it } from 'vitest';
import { getLegalMoves } from '../rules/legalMoves';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, hasMove, placePiece, setCastling, setTurn } from './testUtils';

describe('castling', () => {
	it('разрешает короткую рокировку белых', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(hasMove(moves, 4, 7, 6, 7, 'castle')).toBe(true);
	});

	it('запрещает рокировку под шахом', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(hasMove(moves, 4, 7, 6, 7, 'castle')).toBe(false);
	});

	it('запрещает рокировку через атакованную клетку', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 6, 0);
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(hasMove(moves, 4, 7, 6, 7, 'castle')).toBe(false);
	});

	it('запрещает рокировку при потерянных правах', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 7, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		setCastling(position, { whiteKingside: false });
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(hasMove(moves, 4, 7, 6, 7, 'castle')).toBe(false);
	});
});
