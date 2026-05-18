import { FC } from 'react';
import { Figure } from '../chess/figures/Figure';

interface LostFiguresProps {
	title: string;
	figures: Figure[];
}

/** Список съеденных фигур одного цвета. */
const LostFigures: FC<LostFiguresProps> = ({ title, figures }) => {
	return (
		<section className="captured-group">
			<h3 className="captured-group__title">{title}</h3>
			<div className="captured-group__pieces" aria-label={title}>
				{figures.map((figure, index) =>
					figure.logo ? (
						<img
							key={`${figure.name}-${index}`}
							className="captured-group__piece"
							src={figure.logo}
							alt=""
							width={28}
							height={28}
						/>
					) : null,
				)}
			</div>
		</section>
	);
};

export default LostFigures;
