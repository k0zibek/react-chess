import { FC } from 'react';
import { Cell } from '../chess/board/Cell';

interface CellComponentProps {
	cell: Cell;
	click: (cell: Cell) => void;
	selected: boolean;
	isAvailable: boolean;
}

/** Одна клетка доски с фигурой и подсветкой. */
const CellComponent: FC<CellComponentProps> = ({ cell, click, selected, isAvailable }) => {
	const isCapture = isAvailable && !!cell.figure;

	return (
		<div
			className={`cell ${cell.color} ${selected ? 'selected' : ''} ${isCapture ? 'capture' : ''}`}
			onClick={() => click(cell)}
		>
			{isAvailable && !cell.figure && <div className='available'></div>}
			{cell.figure?.logo && <img src={cell.figure.logo} alt={cell.figure.name} />}
		</div>
	);
};

export default CellComponent;
