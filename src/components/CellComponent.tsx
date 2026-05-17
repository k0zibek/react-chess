import { FC } from 'react';
import { getCellAriaLabel } from '../chess/boardCoords';
import { Cell } from '../chess/board/Cell';

interface CellComponentProps {
	cell: Cell;
	click: (cell: Cell) => void;
	selected: boolean;
	isAvailable: boolean;
	isFocused: boolean;
}

/** Одна клетка доски с фигурой, подсветкой и a11y-атрибутами. */
const CellComponent: FC<CellComponentProps> = ({
	cell,
	click,
	selected,
	isAvailable,
	isFocused,
}) => {
	const isCapture = isAvailable && !!cell.figure;

	return (
		<div
			role='gridcell'
			tabIndex={isFocused ? 0 : -1}
			aria-selected={selected}
			aria-label={getCellAriaLabel(
				cell.x,
				cell.y,
				cell.figure?.name ?? null,
				selected,
				isAvailable,
			)}
			className={`cell ${cell.color} ${selected ? 'selected' : ''} ${isCapture ? 'capture' : ''} ${isFocused ? 'focused' : ''}`}
			onClick={() => click(cell)}
		>
			{isAvailable && !cell.figure && <div className='available'></div>}
			{cell.figure?.logo && (
				<img src={cell.figure.logo} alt='' aria-hidden='true' />
			)}
		</div>
	);
};

export default CellComponent;
