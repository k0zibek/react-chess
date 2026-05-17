import React, { FC, useCallback, useEffect, useRef } from 'react';
import CellComponent from './CellComponent';
import { PositionSnapshot } from '../chess/ChessGame';
import { Cell } from '../chess/board/Cell';
import { getColorLabel } from '../chess/colorLabels';
import { FigureNames, Colors } from '../chess/types';
import { Move } from '../chess/Move';
import { useBoardKeyboard } from '../hooks/useBoardKeyboard';
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

/** Доска: отображение, клики и клавиатурная навигация. */
const BoardComponent: FC<BoardProps> = ({
	snapshot,
	selectedCell,
	pendingPromotionMoves,
	promotionColor,
	isCellAvailable,
	click,
	handlePromotionSelect,
}) => {
	const focusedCellRef = useRef<HTMLDivElement>(null);

	const activateCell = useCallback(
		(coords: { x: number; y: number }) => {
			click(snapshot.board.getCell(coords.x, coords.y));
		},
		[click, snapshot.board],
	);

	const { focus, handleBoardKeyDown } = useBoardKeyboard(activateCell);

	useEffect(() => {
		focusedCellRef.current?.focus();
	}, [focus.x, focus.y]);

	return (
		<div>
			<h3>Ход: {getColorLabel(snapshot.currentTurn)}</h3>
			<GameStatusBar endState={snapshot.endState} />
			<div
				className="board"
				role="grid"
				aria-label="Шахматная доска"
				aria-rowcount={8}
				aria-colcount={8}
				onKeyDown={handleBoardKeyDown}
			>
				{snapshot.board.cells.map((row, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{row.map((cell) => {
							const isFocused = cell.x === focus.x && cell.y === focus.y;
							return (
								<CellComponent
									ref={isFocused ? focusedCellRef : null}
									click={click}
									cell={cell}
									key={`${cell.x}-${cell.y}`}
									selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
									isAvailable={isCellAvailable(cell)}
									isFocused={isFocused}
								/>
							);
						})}
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
