import { FC } from 'react';
import { Figure } from '../chess/figures/Figure';
import LostFigures from './LostFigures';

interface CapturedPanelProps {
	lostBlack: Figure[];
	lostWhite: Figure[];
}

/** Правая колонка: съеденные фигуры обеих сторон. */
const CapturedPanel: FC<CapturedPanelProps> = ({ lostBlack, lostWhite }) => {
	return (
		<aside className="captured-panel" aria-label="Съеденные фигуры">
			<LostFigures title="Съеденные чёрные" figures={lostBlack} />
			<LostFigures title="Съеденные белые" figures={lostWhite} />
		</aside>
	);
};

export default CapturedPanel;
