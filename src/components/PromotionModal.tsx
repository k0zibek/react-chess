import { FC, useEffect, useRef } from 'react';
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
	const firstButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		firstButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onSelect(FigureNames.QUEEN);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [onSelect]);

	return (
		<div className="promotion-overlay" role="presentation">
			<div
				className="promotion-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="promotion-title"
			>
				<h3 id="promotion-title">Выберите фигуру</h3>
				<div className="promotion-options">
					{PROMOTION_PIECES.map((piece, index) => {
						const logo = getFigureLogo(piece, color);
						return (
							<button
								key={piece}
								ref={index === 0 ? firstButtonRef : undefined}
								className="promotion-btn"
								onClick={() => onSelect(piece)}
								aria-label={LABELS[piece]}
							>
								{logo && <img src={logo} alt="" aria-hidden="true" />}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PromotionModal;
