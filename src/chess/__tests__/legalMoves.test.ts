import { describe, expect, it } from 'vitest';
import { getLegalMoves, isLegalMove } from '../rules/legalMoves';
import { Move } from '../Move';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, hasMove, placePiece, setTurn } from './testUtils';

describe('legalMoves', () => {
	it('возвращает пустой список для пустой клетки', () => {
		const position = createEmptyPosition();
		const cell = position.board.getCell(4, 4);
		expect(getLegalMoves(position, cell)).toEqual([]);
	});

	it('запрещает ход связанной фигурой с линии атаки', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.WHITE, 4, 5);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const rookCell = position.board.getCell(4, 5);
		const moves = getLegalMoves(position, rookCell);
		expect(hasMove(moves, 4, 5, 0, 5)).toBe(false);
		expect(hasMove(moves, 4, 5, 4, 6)).toBe(true);
	});

	it('разрешает только ходы, снимающие шах', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 0, 0);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const kingCell = position.board.getCell(4, 7);
		const moves = getLegalMoves(position, kingCell);
		expect(hasMove(moves, 4, 7, 4, 6)).toBe(false);
		expect(hasMove(moves, 4, 7, 5, 7)).toBe(true);
	});

	it('isLegalMove подтверждает легальный ход', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.KING, Colors.BLACK, 4, 0);
		setTurn(position, Colors.WHITE);

		const from = position.board.getCell(4, 7);
		const to = position.board.getCell(3, 7);
		expect(isLegalMove(position, new Move(from, to, 'normal'))).toBe(true);
	});
});
