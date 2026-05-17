import { FC } from 'react';
import { Colors } from '../models/Colors';
import { FigureNames } from '../models/FigureNames';
import { PROMOTION_PIECES } from '../models/promotion';
import blackBishop from '../assets/black-bishop.png';
import blackKnight from '../assets/black-knight.png';
import blackQueen from '../assets/black-queen.png';
import blackRook from '../assets/black-rook.png';
import whiteBishop from '../assets/white-bishop.png';
import whiteKnight from '../assets/white-knight.png';
import whiteQueen from '../assets/white-queen.png';
import whiteRook from '../assets/white-rook.png';

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

const LOGOS: Record<Colors, Partial<Record<FigureNames, string>>> = {
	[Colors.WHITE]: {
		[FigureNames.QUEEN]: whiteQueen,
		[FigureNames.ROOK]: whiteRook,
		[FigureNames.BISHOP]: whiteBishop,
		[FigureNames.KNIGHT]: whiteKnight,
	},
	[Colors.BLACK]: {
		[FigureNames.QUEEN]: blackQueen,
		[FigureNames.ROOK]: blackRook,
		[FigureNames.BISHOP]: blackBishop,
		[FigureNames.KNIGHT]: blackKnight,
	},
};

/** Модальное окно выбора фигуры при превращении пешки. */
const PromotionModal: FC<PromotionModalProps> = ({ color, onSelect }) => {
	return (
		<div className='promotion-overlay'>
			<div className='promotion-modal'>
				<h3>Выберите фигуру</h3>
				<div className='promotion-options'>
					{PROMOTION_PIECES.map((piece) => (
						<button
							key={piece}
							className='promotion-btn'
							onClick={() => onSelect(piece)}
							aria-label={LABELS[piece]}
						>
							<img src={LOGOS[color][piece]} alt={LABELS[piece]} />
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default PromotionModal;
