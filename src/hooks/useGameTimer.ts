import { useCallback, useEffect, useRef, useState } from 'react';
import { Colors } from '../chess/types';
import { INITIAL_TIME_SECONDS } from '../constants/timer';
import { popTimerSnapshot, pushTimerSnapshot, TimerSnapshot } from '../utils/timerHistory';
import { tickTime } from '../utils/timerUtils';

/** Таймер партии с историей для синхронного undo. */
export function useGameTimer(
	currentTurn: Colors,
	isGameOver: boolean,
	onTimeExpired: (loser: Colors) => void,
) {
	const [whiteTime, setWhiteTime] = useState(INITIAL_TIME_SECONDS);
	const [blackTime, setBlackTime] = useState(INITIAL_TIME_SECONDS);
	const historyRef = useRef<TimerSnapshot[]>([]);
	const timesRef = useRef({ white: INITIAL_TIME_SECONDS, black: INITIAL_TIME_SECONDS });
	const onTimeExpiredRef = useRef(onTimeExpired);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		timesRef.current = { white: whiteTime, black: blackTime };
	}, [whiteTime, blackTime]);

	useEffect(() => {
		onTimeExpiredRef.current = onTimeExpired;
	}, [onTimeExpired]);

	const pushSnapshot = useCallback(() => {
		pushTimerSnapshot(historyRef.current, {
			whiteTime: timesRef.current.white,
			blackTime: timesRef.current.black,
		});
	}, []);

	const discardLastSnapshot = useCallback(() => {
		popTimerSnapshot(historyRef.current);
	}, []);

	const restoreSnapshot = useCallback(() => {
		const previous = popTimerSnapshot(historyRef.current);
		if (!previous) return false;
		setWhiteTime(previous.whiteTime);
		setBlackTime(previous.blackTime);
		return true;
	}, []);

	const reset = useCallback(() => {
		historyRef.current = [];
		setWhiteTime(INITIAL_TIME_SECONDS);
		setBlackTime(INITIAL_TIME_SECONDS);
	}, []);

	const decrement = useCallback((color: Colors) => {
		const setter = color === Colors.WHITE ? setWhiteTime : setBlackTime;
		setter((prev) => {
			if (prev <= 0) return 0;
			const next = tickTime(prev);
			if (next === 0) onTimeExpiredRef.current(color);
			return next;
		});
	}, []);

	useEffect(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (isGameOver) return;

		const tick = () => decrement(currentTurn);
		timerRef.current = setInterval(tick, 1000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [currentTurn, isGameOver, decrement]);

	return {
		whiteTime,
		blackTime,
		pushSnapshot,
		discardLastSnapshot,
		restoreSnapshot,
		reset,
	};
}
