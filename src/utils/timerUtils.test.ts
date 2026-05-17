import { describe, expect, it } from 'vitest';
import { formatTime, tickTime } from './timerUtils';

describe('timerUtils', () => {
	it('форматирует время в mm:ss', () => {
		expect(formatTime(300)).toBe('5:00');
		expect(formatTime(65)).toBe('1:05');
		expect(formatTime(0)).toBe('0:00');
	});

	it('не уходит в минус при тике', () => {
		expect(tickTime(10)).toBe(9);
		expect(tickTime(0)).toBe(0);
	});
});
