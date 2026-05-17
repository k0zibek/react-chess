import { describe, expect, it } from 'vitest';
import { MAX_UNDO_HISTORY } from '../chess/constants';
import { popTimerSnapshot, pushTimerSnapshot } from './timerHistory';

describe('timerHistory', () => {
	it('ограничивает глубину истории', () => {
		const history: { whiteTime: number; blackTime: number }[] = [];

		for (let i = 0; i < MAX_UNDO_HISTORY + 5; i++) {
			pushTimerSnapshot(history, { whiteTime: i, blackTime: i });
		}

		expect(history).toHaveLength(MAX_UNDO_HISTORY);
		expect(history[0].whiteTime).toBe(5);
	});

	it('восстанавливает последний снимок', () => {
		const history = [{ whiteTime: 300, blackTime: 280 }];
		expect(popTimerSnapshot(history)?.blackTime).toBe(280);
		expect(history).toHaveLength(0);
	});
});
