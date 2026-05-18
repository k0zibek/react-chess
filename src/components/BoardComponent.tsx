import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import CellComponent from './CellComponent';
import { PositionSnapshot } from '../chess/ChessGame';
import { Cell } from '../chess/board/Cell';
import { fileLabel, rankLabel } from '../chess/boardCoords';
import { findKing } from '../chess/rules/attack';
import { Move } from '../chess/Move';
import { useBoardKeyboard } from '../hooks/useBoardKeyboard';
import PromotionModal from './PromotionModal';
import { Colors, FigureNames } from '../chess/types';

interface BoardProps {
	snapshot: PositionSnapshot;
	selectedCell: Cell | null;
	pendingPromotionMoves: Move[] | null;
	promotionColor: Colors | null;
	isCellAvailable: (cell: Cell) => boolean;
	click: (cell: Cell) => void;
	handlePromotionSelect: (piece: FigureNames) => void;
}

const FILES = Array.from({ length: 8 }, (_, x) => fileLabel(x));
const RANKS = Array.from({ length: 8 }, (_, y) => rankLabel(y));

/** Доска: отображение, координаты, клики и клавиатурная навигация. */
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

	const kingUnderThreat = useMemo(() => {
		if (snapshot.endState.kind !== 'check' && snapshot.endState.kind !== 'checkmate') {
			return null;
		}
		return findKing(snapshot.board, snapshot.currentTurn);
	}, [snapshot.board, snapshot.currentTurn, snapshot.endState.kind]);

	const isCheckmate = snapshot.endState.kind === 'checkmate';
	const isCheck = snapshot.endState.kind === 'check';

	const isLastMoveSquare = useCallback(
		(x: number, y: number) => {
			const last = snapshot.lastMove;
			if (!last) return false;
			return (
				(last.from.x === x && last.from.y === y) || (last.to.x === x && last.to.y === y)
			);
		},
		[snapshot.lastMove],
	);

	useEffect(() => {
		focusedCellRef.current?.focus();
	}, [focus.x, focus.y]);

	return (
		<div className="board-area">
			<div className="board-frame">
				<div className="board-coords board-coords--top" aria-hidden="true">
					{FILES.map((file) => (
						<span key={file} className="board-coords__label">
							{file}
						</span>
					))}
				</div>
				<div className="board-middle">
					<div className="board-coords board-coords--left" aria-hidden="true">
						{RANKS.map((rank) => (
							<span key={rank} className="board-coords__label">
								{rank}
							</span>
						))}
					</div>
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
									const isKingSquare =
										kingUnderThreat !== null &&
										cell.x === kingUnderThreat.x &&
										cell.y === kingUnderThreat.y;
									return (
										<CellComponent
											ref={isFocused ? focusedCellRef : null}
											click={click}
											cell={cell}
											key={`${cell.x}-${cell.y}`}
											selected={
												cell.x === selectedCell?.x && cell.y === selectedCell?.y
											}
											isAvailable={isCellAvailable(cell)}
											isFocused={isFocused}
											isLastMove={isLastMoveSquare(cell.x, cell.y)}
											isInCheck={isKingSquare && isCheck}
											isInCheckmate={isKingSquare && isCheckmate}
										/>
									);
								})}
							</React.Fragment>
						))}
					</div>
					<div className="board-coords board-coords--right" aria-hidden="true">
						{RANKS.map((rank) => (
							<span key={`r-${rank}`} className="board-coords__label">
								{rank}
							</span>
						))}
					</div>
				</div>
				<div className="board-coords board-coords--bottom" aria-hidden="true">
					{FILES.map((file) => (
						<span key={`b-${file}`} className="board-coords__label">
							{file}
						</span>
					))}
				</div>
			</div>
			{promotionColor && pendingPromotionMoves && (
				<PromotionModal color={promotionColor} onSelect={handlePromotionSelect} />
			)}
		</div>
	);
};

export default BoardComponent;
