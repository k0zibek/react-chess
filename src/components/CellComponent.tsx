import { forwardRef } from 'react';
import { getCellAriaLabel } from '../chess/boardCoords';
import { Cell } from '../chess/board/Cell';
import { Colors } from '../chess/types';

interface CellComponentProps {
	cell: Cell;
	click: (cell: Cell) => void;
	selected: boolean;
	isAvailable: boolean;
	isFocused: boolean;
	isLastMove: boolean;
	isInCheck: boolean;
	isInCheckmate: boolean;
}

/** Одна клетка доски с фигурой, подсветкой и a11y-атрибутами. */
const CellComponent = forwardRef<HTMLDivElement, CellComponentProps>(
	({ cell, click, selected, isAvailable, isFocused, isLastMove, isInCheck, isInCheckmate }, ref) => {
		const isCapture = isAvailable && !!cell.figure;
		const shade = cell.color === Colors.WHITE ? 'light' : 'dark';

		return (
			<div
				ref={ref}
				role="gridcell"
				tabIndex={isFocused ? 0 : -1}
				aria-selected={selected}
				aria-label={getCellAriaLabel(
					cell.x,
					cell.y,
					cell.figure?.name ?? null,
					selected,
					isAvailable,
				)}
				className={[
					'cell',
					`cell--${shade}`,
					selected ? 'cell--selected' : '',
					isCapture ? 'cell--capture' : '',
					isFocused ? 'cell--focused' : '',
					isLastMove ? 'cell--last-move' : '',
					isInCheck ? 'cell--in-check' : '',
					isInCheckmate ? 'cell--in-checkmate' : '',
				]
					.filter(Boolean)
					.join(' ')}
				onClick={() => click(cell)}
			>
				{isAvailable && !cell.figure && <span className="cell__dot" aria-hidden="true" />}
				{cell.figure?.logo && <img src={cell.figure.logo} alt="" aria-hidden="true" />}
			</div>
		);
	},
);

CellComponent.displayName = 'CellComponent';

export default CellComponent;
