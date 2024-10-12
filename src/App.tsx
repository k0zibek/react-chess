import { useEffect, useState } from 'react';
import BoardComponent from './components/BoardComponent';
import './styles/App.css';
import { Board } from './models/Board';
import { Colors } from './models/Colors';
import { Player } from './models/Player';
import LostFigures from './components/LostFigures';
import Timer from './components/Timer';

function App() {
	const [board, setBoard] = useState(new Board());
	const [whitePlayer] = useState(new Player(Colors.WHITE));
	const [blackPlayer] = useState(new Player(Colors.BLACK));
	const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

	useEffect(() => {
		setCurrentPlayer(whitePlayer);
		restart();
	}, []);

	function restart() {
		const newBoard = new Board();
		newBoard.initCells();
		newBoard.addFigures();
		setBoard(newBoard);
		setCurrentPlayer(whitePlayer);
	}

	function swapPlayer() {
		setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
	}

	return (
		<div className='app container'>
			<Timer currentPlayer={currentPlayer} restart={restart} />
			<BoardComponent board={board} setBoard={setBoard} currentPlayer={currentPlayer} swapPlayer={swapPlayer} />
			<div>
				<LostFigures title={'Черные фигуры'} figures={board.lostBlackFigures} />
				<LostFigures title={'Белые фигуры'} figures={board.lostWhiteFigures} />
			</div>
		</div>
	);
}

export default App;
