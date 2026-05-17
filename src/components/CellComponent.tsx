import { FC } from 'react';
import { Cell } from '../models/Cell';

interface CellProps {
	cell: Cell;
	selected: boolean;
	isAvailable: boolean;
	click: (cell: Cell) => void;
}

/** Клетка доски с подсветкой выбора и доступных ходов. */
const CellComponent: FC<CellProps> = ({ cell, selected, isAvailable, click }) => {
	const isCapture = isAvailable && !!cell.figure;

	return (
		<div
			className={['cell', cell.color, selected ? 'selected' : ''].join(' ')}
			onClick={() => click(cell)}
			style={{ background: isCapture ? '#bf9300' : '' }}
		>
			{isAvailable && !cell.figure && <div className='available'></div>}
			{cell.figure?.logo && <img src={cell.figure.logo} alt='' />}
		</div>
	);
};

export default CellComponent;
