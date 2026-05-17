/** Форматирует секунды в mm:ss. */
export function formatTime(seconds: number): string {
	const safe = Math.max(0, seconds);
	const minutes = Math.floor(safe / 60);
	const secs = safe % 60;
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/** Уменьшает таймер на секунду и возвращает новое значение. */
export function tickTime(current: number): number {
	return Math.max(0, current - 1);
}
