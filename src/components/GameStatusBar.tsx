import { FC } from 'react';
import { Colors } from '../models/Colors';
import { GameStatus } from '../models/GameStatus';

interface GameStatusBarProps {
	status: GameStatus;
	currentTurn: Colors;
}

/** Отображает текущий статус партии: шах, мат или пат. */
const GameStatusBar: FC<GameStatusBarProps> = ({ status, currentTurn }) => {
	const turnLabel = currentTurn === Colors.WHITE ? 'белые' : 'чёрные';

	if (status === GameStatus.CHECKMATE) {
		const winner = currentTurn === Colors.WHITE ? 'чёрные' : 'белые';
		return <p className='game-status game-status--mate'>Мат! Победили {winner}</p>;
	}
	if (status === GameStatus.STALEMATE) {
		return <p className='game-status game-status--stalemate'>Пат — ничья</p>;
	}
	if (status === GameStatus.CHECK) {
		return <p className='game-status game-status--check'>Шах! Ход {turnLabel}</p>;
	}
	return null;
};

export default GameStatusBar;
