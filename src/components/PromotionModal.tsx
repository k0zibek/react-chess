import { FC } from 'react';
import { Colors, FigureNames } from '../chess/types';
import { getFigureLogo } from '../chess/figures/figureAssets';
import { PROMOTION_PIECES } from '../chess/constants';

interface PromotionModalProps {
	color: Colors;
	onSelect: (piece: FigureNames) => void;
}

const LABELS: Record<FigureNames, string> = {
	[FigureNames.QUEEN]: 'Ферзь',
	[FigureNames.ROOK]: 'Ладья',
	[FigureNames.BISHOP]: 'Слон',
	[FigureNames.KNIGHT]: 'Конь',
	[FigureNames.KING]: 'Король',
	[FigureNames.PAWN]: 'Пешка',
	[FigureNames.FIGURE]: 'Фигура',
};

/** Модальное окно выбора фигуры при превращении пешки. */
const PromotionModal: FC<PromotionModalProps> = ({ color, onSelect }) => {
	return (
		<div className='promotion-overlay'>
			<div className='promotion-modal'>
				<h3>Выберите фигуру</h3>
				<div className='promotion-options'>
					{PROMOTION_PIECES.map((piece) => {
						const logo = getFigureLogo(piece, color);
						return (
							<button
								key={piece}
								className='promotion-btn'
								onClick={() => onSelect(piece)}
								aria-label={LABELS[piece]}
							>
								{logo && <img src={logo} alt={LABELS[piece]} />}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PromotionModal;
