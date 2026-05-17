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
		isCellAvailable,
		click,
		handlePromotionSelect,
		restart,
	} = useChessGame();

	return (
		<div className='app container'>
			<Timer
				currentTurn={snapshot.currentTurn}
				isGameOver={isGameOver}
				restart={restart}
			/>
			<BoardComponent
				snapshot={snapshot}
				selectedCell={selectedCell}
				pendingPromotionMoves={pendingPromotionMoves}
				promotionColor={promotionColor}
				isCellAvailable={isCellAvailable}
				click={click}
				handlePromotionSelect={handlePromotionSelect}
			/>
			<div>
				<LostFigures title={'Черные фигуры'} figures={snapshot.board.lostBlackFigures} />
				<LostFigures title={'Белые фигуры'} figures={snapshot.board.lostWhiteFigures} />
			</div>
		</div>
	);
}

export default App;
