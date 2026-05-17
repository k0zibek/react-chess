import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Colors } from '../models/Colors';

interface TimerProps {
	currentTurn: Colors;
	isGameOver: boolean;
	restart: () => void;
}

/** Таймер партии с остановкой при завершении игры. */
const Timer: FC<TimerProps> = ({ currentTurn, isGameOver, restart }) => {
	const [blackTime, setBlackTime] = useState(300);
	const [whiteTime, setWhiteTime] = useState(300);
	const timer = useRef<null | ReturnType<typeof setInterval>>(null);

	const decrementBlackTimer = useCallback(() => {
		setBlackTime((prev) => prev - 1);
	}, []);

	const decrementWhiteTimer = useCallback(() => {
		setWhiteTime((prev) => prev - 1);
	}, []);

	useEffect(() => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
		if (isGameOver) {
			return;
		}
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
		setWhiteTime(300);
		setBlackTime(300);
		restart();
	};

	return (
		<div className='timer-container'>
			<div>
				<button className='btn' onClick={handleRestart}>
					Restart game
				</button>
			</div>

			<h2>Черные - {blackTime}</h2>
			<h2>Белые - {whiteTime}</h2>
		</div>
	);
};

export default Timer;
