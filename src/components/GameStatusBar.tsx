import { FC } from 'react';
import { getColorLabel } from '../chess/colorLabels';
import { GameEndState } from '../chess/types';

interface GameStatusBarProps {
	endState: GameEndState;
}

/** Отображает текущий статус партии: шах, мат, пат или победа по времени. */
const GameStatusBar: FC<GameStatusBarProps> = ({ endState }) => {
	switch (endState.kind) {
		case 'timeout':
			return (
				<p className="game-status game-status--timeout">
					Победа по времени: {getColorLabel(endState.winner)}
				</p>
			);
		case 'checkmate':
			return (
				<p className="game-status game-status--mate">
					Мат! Победили {getColorLabel(endState.winner)}
				</p>
			);
		case 'stalemate':
			return <p className="game-status game-status--stalemate">Пат — ничья</p>;
		case 'check':
			return <p className="game-status game-status--check">Шах!</p>;
		default:
			return null;
	}
};

export default GameStatusBar;
