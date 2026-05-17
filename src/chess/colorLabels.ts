import { Colors } from './types';

/** Возвращает русское название цвета фигур. */
export function getColorLabel(color: Colors): string {
	return color === Colors.WHITE ? 'белые' : 'чёрные';
}
