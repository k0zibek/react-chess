import { FC } from 'react';
import { getColorLabel } from '../chess/colorLabels';
import { Colors, GameStatus } from '../chess/types';

interface GameStatusBarProps {
	status: GameStatus;
	currentTurn: Colors;
	timeWinner: Colors | null;
}

/** Отображает текущий статус партии: шах, мат, пат или победа по времени. */
const GameStatusBar: FC<GameStatusBarProps> = ({ status, currentTurn, timeWinner }) => {
	if (timeWinner) {
		return (
			<p className="game-status game-status--timeout">
				Победа по времени: {getColorLabel(timeWinner)}
			</p>
		);
	}

	const turnLabel = getColorLabel(currentTurn);

	if (status === GameStatus.CHECKMATE) {
		const winner = currentTurn === Colors.WHITE ? 'чёрные' : 'белые';
		return <p className="game-status game-status--mate">Мат! Победили {winner}</p>;
	}
	if (status === GameStatus.STALEMATE) {
		return <p className="game-status game-status--stalemate">Пат — ничья</p>;
	}
	if (status === GameStatus.CHECK) {
		return <p className="game-status game-status--check">Шах! Ход {turnLabel}</p>;
	}
	return null;
};

export default GameStatusBar;
