/** Возвращает шахматную нотацию клетки, например e4. */
export function toAlgebraic(x: number, y: number): string {
	const file = String.fromCharCode(97 + x);
	const rank = 8 - y;
	return `${file}${rank}`;
}

/** Буква файла (a–h) по координате x. */
export function fileLabel(x: number): string {
	return String.fromCharCode(97 + x);
}

/** Цифра ранга (1–8) по координате y. */
export function rankLabel(y: number): string {
	return String(8 - y);
}

/** Описание клетки для screen reader. */
export function getCellAriaLabel(
	x: number,
	y: number,
	pieceName: string | null,
	isSelected: boolean,
	isAvailable: boolean,
): string {
	const square = toAlgebraic(x, y);
	if (!pieceName) {
		if (isAvailable) return `${square}, пустая клетка, доступный ход`;
		if (isSelected) return `${square}, пустая клетка, выбрана`;
		return `${square}, пустая клетка`;
	}
	if (isAvailable) return `${square}, ${pieceName}, можно взять`;
	if (isSelected) return `${square}, ${pieceName}, выбрана`;
	return `${square}, ${pieceName}`;
}
