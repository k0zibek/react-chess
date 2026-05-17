import { FC } from 'react';
import { Figure } from '../chess/figures/Figure';

interface LostFiguresProps {
	title: string;
	figures: Figure[];
}

/** Список съеденных фигур. */
const LostFigures: FC<LostFiguresProps> = ({ title, figures }) => {
	return (
		<div className="lost">
			<h3>{title}</h3>
			{figures.map((figure, index) => (
				<div key={`${figure.name}-${index}`}>
					{figure.name} {figure.logo && <img width={20} height={20} src={figure.logo} alt="" />}
				</div>
			))}
		</div>
	);
};

export default LostFigures;
