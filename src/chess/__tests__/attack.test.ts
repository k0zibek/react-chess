import { describe, expect, it } from 'vitest';
import { isKingInCheck, isSquareAttacked } from '../rules/attack';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, placePiece } from './testUtils';

describe('attack', () => {
	it('определяет атаку ладьи по вертикали', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		expect(isSquareAttacked(position.board, 4, 7, Colors.BLACK)).toBe(true);
		expect(isSquareAttacked(position.board, 3, 7, Colors.BLACK)).toBe(false);
	});

	it('определяет атаку коня', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KNIGHT, Colors.WHITE, 4, 4);
		expect(isSquareAttacked(position.board, 6, 5, Colors.WHITE)).toBe(true);
		expect(isSquareAttacked(position.board, 5, 5, Colors.WHITE)).toBe(false);
	});

	it('не считает атакой заблокированный луч', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 0, 0);
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 0, 3);
		expect(isSquareAttacked(position.board, 0, 7, Colors.BLACK)).toBe(false);
	});

	it('определяет шах белому королю', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 4, 0);
		expect(isKingInCheck(position.board, Colors.WHITE)).toBe(true);
	});

	it('не считает шахом, если король не под атакой', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		placePiece(position, FigureNames.ROOK, Colors.BLACK, 0, 0);
		expect(isKingInCheck(position.board, Colors.WHITE)).toBe(false);
	});
});
