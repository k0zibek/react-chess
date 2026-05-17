import React, { FC } from 'react';
import CellComponent from './CellComponent';
import { PositionSnapshot } from '../chess/ChessGame';
import { Cell } from '../chess/board/Cell';
import { Colors, FigureNames } from '../chess/types';
import { Move } from '../chess/Move';
import GameStatusBar from './GameStatusBar';
import PromotionModal from './PromotionModal';

interface BoardProps {
	snapshot: PositionSnapshot;
	selectedCell: Cell | null;
	pendingPromotionMoves: Move[] | null;
	promotionColor: Colors | null;
	isCellAvailable: (cell: Cell) => boolean;
	click: (cell: Cell) => void;
	handlePromotionSelect: (piece: FigureNames) => void;
}

/** Доска: только отображение и делегирование кликов. */
const BoardComponent: FC<BoardProps> = ({
	snapshot,
	selectedCell,
	pendingPromotionMoves,
	promotionColor,
	isCellAvailable,
	click,
	handlePromotionSelect,
}) => {
	return (
		<div>
			<h3>Текущий игрок {snapshot.currentTurn}</h3>
			<GameStatusBar status={snapshot.status} currentTurn={snapshot.currentTurn} />
			<div className='board'>
				{snapshot.board.cells.map((row, rowIndex) => (
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
			{promotionColor && pendingPromotionMoves && (
				<PromotionModal color={promotionColor} onSelect={handlePromotionSelect} />
			)}
		</div>
	);
};

export default BoardComponent;
