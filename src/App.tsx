import { useCallback, useState } from 'react';
import BoardComponent from './components/BoardComponent';
import './styles/App.css';
import { GameState } from './models/GameState';
import { GameStatus } from './models/GameStatus';
import LostFigures from './components/LostFigures';
import Timer from './components/Timer';

function App() {
	const [gameState, setGameState] = useState(() => GameState.createInitial());
	const [restartKey, setRestartKey] = useState(0);

	const restart = useCallback(() => {
		setGameState(GameState.createInitial());
		setRestartKey((key) => key + 1);
	}, []);

	const isGameOver =
		gameState.status === GameStatus.CHECKMATE || gameState.status === GameStatus.STALEMATE;

	return (
		<div className='app container'>
			<Timer
				currentTurn={gameState.currentTurn}
				isGameOver={isGameOver}
				restart={restart}
			/>
			<BoardComponent
				key={restartKey}
				gameState={gameState}
				setGameState={setGameState}
			/>
			<div>
				<LostFigures title={'Черные фигуры'} figures={gameState.board.lostBlackFigures} />
				<LostFigures title={'Белые фигуры'} figures={gameState.board.lostWhiteFigures} />
			</div>
		</div>
	);
}

export default App;
