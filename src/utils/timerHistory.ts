import { MAX_UNDO_HISTORY } from '../chess/constants';

export interface TimerSnapshot {
	whiteTime: number;
	blackTime: number;
}

/** Добавляет снимок таймера с ограничением глубины истории. */
export function pushTimerSnapshot(history: TimerSnapshot[], snapshot: TimerSnapshot): void {
	history.push(snapshot);
	if (history.length > MAX_UNDO_HISTORY) {
		history.shift();
	}
}

/** Возвращает последний снимок таймера. */
export function popTimerSnapshot(history: TimerSnapshot[]): TimerSnapshot | undefined {
	return history.pop();
}
