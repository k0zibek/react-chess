import BoardComponent from './components/BoardComponent';
import './styles/App.css';
import LostFigures from './components/LostFigures';
import Timer from './components/Timer';
import { useChessGame } from './hooks/useChessGame';

function App() {
	const {
		snapshot,
		selectedCell,
		pendingPromotionMoves,
		promotionColor,
		isGameOver,
		timeWinner,
		canUndo,
		isCellAvailable,
		click,
		handlePromotionSelect,
		handleTimeExpired,
		undo,
		restart,
	} = useChessGame();

	return (
		<div className='app container'>
			<Timer
				currentTurn={snapshot.currentTurn}
				isGameOver={isGameOver}
				canUndo={canUndo}
				onTimeExpired={handleTimeExpired}
				undo={undo}
				restart={restart}
			/>
			<BoardComponent
				snapshot={snapshot}
				selectedCell={selectedCell}
				pendingPromotionMoves={pendingPromotionMoves}
				promotionColor={promotionColor}
				timeWinner={timeWinner}
				isCellAvailable={isCellAvailable}
				click={click}
				handlePromotionSelect={handlePromotionSelect}
			/>
			<div>
				<LostFigures title='Съеденные чёрные' figures={snapshot.board.lostBlackFigures} />
				<LostFigures title='Съеденные белые' figures={snapshot.board.lostWhiteFigures} />
			</div>
		</div>
	);
}

export default App;
