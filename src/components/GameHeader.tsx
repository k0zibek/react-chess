import { FC } from 'react';
import { getColorLabel } from '../chess/colorLabels';
import { Colors, GameEndState } from '../chess/types';
import GameStatusBar from './GameStatusBar';

interface GameHeaderProps {
	currentTurn: Colors;
	endState: GameEndState;
}

/** Шапка партии: чей ход и статус (шах, мат и т.д.). */
const GameHeader: FC<GameHeaderProps> = ({ currentTurn, endState }) => {
	return (
		<header className="game-header">
			<p className="game-header__turn">Ход: {getColorLabel(currentTurn)}</p>
			<GameStatusBar endState={endState} />
		</header>
	);
};

export default GameHeader;
