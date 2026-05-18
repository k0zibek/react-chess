import BoardComponent from './components/BoardComponent';
import './styles/App.css';
import CapturedPanel from './components/CapturedPanel';
import GameHeader from './components/GameHeader';
import Timer from './components/Timer';
import { useChessGame } from './hooks/useChessGame';

function App() {
	const {
		snapshot,
		selectedCell,
		pendingPromotionMoves,
		promotionColor,
		isGameOver,
		canUndo,
		whiteTime,
		blackTime,
		isCellAvailable,
		click,
		handlePromotionSelect,
		undo,
		restart,
	} = useChessGame();

	return (
		<div className="app container">
			<div className="app-layout">
				<Timer
					whiteTime={whiteTime}
					blackTime={blackTime}
					currentTurn={snapshot.currentTurn}
					isGameOver={isGameOver}
					canUndo={canUndo}
					undo={undo}
					restart={restart}
				/>
				<main className="app-main">
					<GameHeader currentTurn={snapshot.currentTurn} endState={snapshot.endState} />
					<BoardComponent
						snapshot={snapshot}
						selectedCell={selectedCell}
						pendingPromotionMoves={pendingPromotionMoves}
						promotionColor={promotionColor}
						isCellAvailable={isCellAvailable}
						click={click}
						handlePromotionSelect={handlePromotionSelect}
					/>
				</main>
				<CapturedPanel
					lostBlack={snapshot.board.lostBlackFigures}
					lostWhite={snapshot.board.lostWhiteFigures}
				/>
			</div>
		</div>
	);
}

export default App;
