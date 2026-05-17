/** Возвращает шахматную нотацию клетки, например e4. */
export function toAlgebraic(x: number, y: number): string {
	const file = String.fromCharCode(97 + x);
	const rank = 8 - y;
	return `${file}${rank}`;
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
