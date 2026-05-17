import { FC } from 'react';
import { formatTime } from '../utils/timerUtils';

interface TimerProps {
	whiteTime: number;
	blackTime: number;
	canUndo: boolean;
	isGameOver: boolean;
	undo: () => void;
	restart: () => void;
}

/** Панель таймера и управления партией. */
const Timer: FC<TimerProps> = ({
	whiteTime,
	blackTime,
	canUndo,
	isGameOver,
	undo,
	restart,
}) => {
	return (
		<div className='timer-container'>
			<div className='timer-actions'>
				<button className='btn' onClick={restart}>
					Новая партия
				</button>
				<button className='btn btn-secondary' onClick={undo} disabled={!canUndo || isGameOver}>
					Отменить ход
				</button>
			</div>
			<h2>Чёрные — {formatTime(blackTime)}</h2>
			<h2>Белые — {formatTime(whiteTime)}</h2>
		</div>
	);
};

export default Timer;
