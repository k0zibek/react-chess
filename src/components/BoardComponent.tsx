import React, { FC } from 'react';
import CellComponent from './CellComponent';
import { GameState } from '../models/GameState';
import { useChessBoard } from '../hooks/useChessBoard';
import GameStatusBar from './GameStatusBar';
import PromotionModal from './PromotionModal';

interface BoardProps {
	gameState: GameState;
	setGameState: (state: GameState) => void;
}

/** Доска: выбор фигуры, подсветка легальных ходов и применение ходов. */
const BoardComponent: FC<BoardProps> = ({ gameState, setGameState }) => {
	const { selectedCell, pendingPromotionMoves, isCellAvailable, click, handlePromotionSelect } =
		useChessBoard(gameState, setGameState);

	return (
		<div>
			<h3>Текущий игрок {gameState.currentTurn}</h3>
			<GameStatusBar status={gameState.status} currentTurn={gameState.currentTurn} />
			<div className='board'>
				{gameState.board.cells.map((row, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{row.map((cell) => (
							<CellComponent
								click={click}
								cell={cell}
								key={`${cell.x}-${cell.y}`}
								selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
								isAvailable={isCellAvailable(cell)}
							/>
						))}
					</React.Fragment>
				))}
			</div>
			{pendingPromotionMoves && (
				<PromotionModal
					color={pendingPromotionMoves[0].from.figure!.color}
					onSelect={handlePromotionSelect}
				/>
			)}
		</div>
	);
};

export default BoardComponent;
