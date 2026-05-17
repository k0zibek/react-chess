import { describe, expect, it } from 'vitest';
import { getCellAriaLabel, toAlgebraic } from '../boardCoords';

describe('boardCoords', () => {
	it('возвращает алгебраическую нотацию', () => {
		expect(toAlgebraic(4, 6)).toBe('e2');
		expect(toAlgebraic(0, 7)).toBe('a1');
		expect(toAlgebraic(7, 0)).toBe('h8');
	});

	it('формирует aria-label для клетки с фигурой', () => {
		expect(getCellAriaLabel(4, 6, 'Пешка', false, false)).toBe('e2, Пешка');
		expect(getCellAriaLabel(4, 4, null, false, true)).toBe('e4, пустая клетка, доступный ход');
	});
});
