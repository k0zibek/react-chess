import { describe, expect, it } from 'vitest';
import { Pawn } from '../figures/Pawn';
import { King } from '../figures/King';
import { Colors, FigureNames } from '../types';
import { createEmptyPosition, placePiece } from './testUtils';

describe('Pawn move state', () => {
	it('onMoved сбрасывает isFirstStep', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 6);
		const pawn = position.board.getCell(4, 6).figure as Pawn;

		expect(pawn.isFirstStep).toBe(true);
		pawn.onMoved();
		expect(pawn.isFirstStep).toBe(false);
	});

	it('getPawnFirstStepForRecord отражает isFirstStep', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 6);
		const pawn = position.board.getCell(4, 6).figure as Pawn;

		expect(pawn.getPawnFirstStepForRecord()).toBe(true);
		pawn.onMoved();
		expect(pawn.getPawnFirstStepForRecord()).toBe(false);
	});

	it('restoreMoveState восстанавливает isFirstStep и hasMoved', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.PAWN, Colors.WHITE, 4, 6);
		const pawn = position.board.getCell(4, 6).figure as Pawn;

		pawn.onMoved();
		pawn.hasMoved = true;
		expect(pawn.isFirstStep).toBe(false);
		expect(pawn.hasMoved).toBe(true);

		pawn.restoreMoveState(false, true);
		expect(pawn.isFirstStep).toBe(true);
		expect(pawn.hasMoved).toBe(false);
	});
});

describe('King move state', () => {
	it('onMoved устанавливает hasMoved', () => {
		const position = createEmptyPosition();
		placePiece(position, FigureNames.KING, Colors.WHITE, 4, 7);
		const king = position.board.getCell(4, 7).figure as King;

		expect(king.hasMoved).toBe(false);
		king.onMoved();
		expect(king.hasMoved).toBe(true);
	});
});
