import { describe, expect, it } from 'vitest';
import { ChessGame } from '../ChessGame';
import { Position } from '../Position';
import { clonePosition } from '../positionClone';

const CLONE_ITERATIONS = 50;
/** Порог: если 50 клонов медленнее — стоит оптимизировать undo. */
const CLONE_BUDGET_MS = 500;

/** Прогоняет серию ходов до середины партии. */
function playMidgame(game: ChessGame, moveCount: number): void {
	for (let i = 0; i < moveCount; i++) {
		const snapshot = game.getSnapshot();
		const board = snapshot.board;
		let played = false;

		for (let y = 0; y < 8 && !played; y++) {
			for (let x = 0; x < 8 && !played; x++) {
				const cell = board.getCell(x, y);
				if (cell.figure?.color !== snapshot.currentTurn) continue;
				const legal = game.selectLegalMoves(cell);
				if (legal.length > 0) {
					const move = legal[0];
					if (move) played = game.playMove(move);
				}
			}
		}

		if (!played) break;
	}
}

describe('clone benchmark', () => {
	it(`50 клонов midgame укладываются в ${CLONE_BUDGET_MS}ms`, () => {
		const source = Position.createInitial();
		playMidgame(new ChessGame(source), 20);

		const start = performance.now();
		for (let i = 0; i < CLONE_ITERATIONS; i++) {
			clonePosition(source);
		}
		const elapsed = performance.now() - start;

		expect(elapsed).toBeLessThan(CLONE_BUDGET_MS);
	});
});
