import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Colors } from '../chess/types';
import { formatTime, tickTime } from '../utils/timerUtils';

const INITIAL_TIME_SECONDS = 300;

interface TimerProps {
	currentTurn: Colors;
	isGameOver: boolean;
	onTimeExpired: (loser: Colors) => void;
	restart: () => void;
}

/** Таймер партии: останавливается на нуле и завершает игру по времени. */
const Timer: FC<TimerProps> = ({ currentTurn, isGameOver, onTimeExpired, restart }) => {
	const [blackTime, setBlackTime] = useState(INITIAL_TIME_SECONDS);
	const [whiteTime, setWhiteTime] = useState(INITIAL_TIME_SECONDS);
	const timer = useRef<null | ReturnType<typeof setInterval>>(null);
	const onTimeExpiredRef = useRef(onTimeExpired);

	useEffect(() => {
		onTimeExpiredRef.current = onTimeExpired;
	}, [onTimeExpired]);

	const decrementTimer = useCallback(
		(color: Colors, setter: Dispatch<SetStateAction<number>>) => {
			setter((prev) => {
				if (prev <= 0) return 0;
				const next = tickTime(prev);
				if (next === 0) onTimeExpiredRef.current(color);
				return next;
			});
		},
		[],
	);

	const decrementBlackTimer = useCallback(() => {
		decrementTimer(Colors.BLACK, setBlackTime);
	}, [decrementTimer]);

	const decrementWhiteTimer = useCallback(() => {
		decrementTimer(Colors.WHITE, setWhiteTime);
	}, [decrementTimer]);

	useEffect(() => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
		if (isGameOver) return;

		const callback =
			currentTurn === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
		timer.current = setInterval(callback, 1000);

		return () => {
			if (timer.current) {
				clearInterval(timer.current);
				timer.current = null;
			}
		};
	}, [currentTurn, isGameOver, decrementBlackTimer, decrementWhiteTimer]);

	const handleRestart = () => {
		setWhiteTime(INITIAL_TIME_SECONDS);
		setBlackTime(INITIAL_TIME_SECONDS);
		restart();
	};

	return (
		<div className='timer-container'>
			<button className='btn' onClick={handleRestart}>
				Новая партия
			</button>
			<h2>Чёрные — {formatTime(blackTime)}</h2>
			<h2>Белые — {formatTime(whiteTime)}</h2>
		</div>
	);
};

export default Timer;
