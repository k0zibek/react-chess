import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Player } from '../models/Player';
import { Colors } from '../models/Colors';

interface TimerProps {
	currentPlayer: Player | null;
	restart: () => void;
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
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
		if (currentPlayer === null) {
			return;
		}
		const callback =
			currentPlayer.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
		timer.current = setInterval(callback, 1000);
		return () => {
			if (timer.current) {
				clearInterval(timer.current);
				timer.current = null;
			}
		};
	}, [currentPlayer, decrementBlackTimer, decrementWhiteTimer]);

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
