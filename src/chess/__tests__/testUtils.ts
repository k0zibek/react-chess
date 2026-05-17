import { Position } from '../Position';
import { Move } from '../Move';
import { CastlingRights } from '../CastlingRights';
import { createFigure } from '../figures/createFigure';
import { Colors, FigureNames, GameStatus, MoveType } from '../types';

/** Пустая доска без фигур. */
export function createEmptyPosition(): Position {
	const position = new Position();
	position.board.initCells();
	return position;
}

/** Ставит фигуру на клетку. */
export function placePiece(
	position: Position,
	name: FigureNames,
	color: Colors,
	x: number,
	y: number,
): void {
	createFigure(name, color, position.board.getCell(x, y));
}

/** Устанавливает очередь хода. */
export function setTurn(position: Position, color: Colors): void {
	position.currentTurn = color;
}

/** Устанавливает права на рокировку. */
export function setCastling(position: Position, rights: Partial<CastlingRights>): void {
	Object.assign(position.castling, rights);
}

/** Устанавливает цель для взятия на проходе. */
export function setEnPassantTarget(position: Position, x: number, y: number): void {
	position.enPassantTarget = position.board.getCell(x, y);
}

/** Устанавливает статус партии. */
export function setStatus(position: Position, status: GameStatus): void {
	position.status = status;
}

/** Помечает пешку как уже ходившую (без права двойного хода). */
export function markPawnMoved(position: Position, x: number, y: number): void {
	const figure = position.board.getCell(x, y).figure;
	if (figure?.name === FigureNames.PAWN) {
		figure.onMoved();
	}
}

/** Проверяет наличие хода в списке. */
export function hasMove(
	moves: Move[],
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	type: MoveType = 'normal',
	promotionPiece?: FigureNames,
): boolean {
	const from = { x: fromX, y: fromY };
	const to = { x: toX, y: toY };
	return moves.some(
		(move) =>
			move.from.x === from.x &&
			move.from.y === from.y &&
			move.to.x === to.x &&
			move.to.y === to.y &&
			move.type === type &&
			(promotionPiece === undefined || move.promotionPiece === promotionPiece),
	);
}
