import { FC } from 'react';
import { Colors } from '../chess/types';
import { formatTime } from '../utils/timerUtils';

interface TimerProps {
	whiteTime: number;
	blackTime: number;
	currentTurn: Colors;
	canUndo: boolean;
	isGameOver: boolean;
	undo: () => void;
	restart: () => void;
}

/** Панель таймера и управления партией. */
const Timer: FC<TimerProps> = ({
	whiteTime,
	blackTime,
	currentTurn,
	canUndo,
	isGameOver,
	undo,
	restart,
}) => {
	return (
		<aside className="timer-panel">
			<div className="timer-actions">
				<button type="button" className="btn btn--primary" onClick={restart}>
					Новая партия
				</button>
				<button
					type="button"
					className="btn btn--secondary"
					onClick={undo}
					disabled={!canUndo || isGameOver}
				>
					Отменить ход
				</button>
			</div>
			<div
				className={`timer-display ${currentTurn === Colors.BLACK && !isGameOver ? 'timer-display--active' : ''}`}
			>
				<span className="timer-display__label">Чёрные</span>
				<span className="timer-display__time">{formatTime(blackTime)}</span>
			</div>
			<div
				className={`timer-display ${currentTurn === Colors.WHITE && !isGameOver ? 'timer-display--active' : ''}`}
			>
				<span className="timer-display__label">Белые</span>
				<span className="timer-display__time">{formatTime(whiteTime)}</span>
			</div>
		</aside>
	);
};

export default Timer;
