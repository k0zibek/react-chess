import { Board } from '../board/Board';
import { Cell } from '../board/Cell';
import { isOnBoard } from '../constants';
import { Move } from '../Move';

type Direction = [number, number];

/** Генерация ходов и атак для фигур скольжения. */
export class SlidingMover {
	/** Псевдо-легальные ходы по заданным направлениям. */
	static getMoves(
		from: Cell,
		board: Board,
		directions: Direction[],
		canTarget: (target: Cell) => boolean,
	): Move[] {
		const moves: Move[] = [];

		for (const [dx, dy] of directions) {
			let x = from.x + dx;
			let y = from.y + dy;

			while (isOnBoard(x, y)) {
				const target = board.getCell(x, y);
				if (target.isEmpty()) {
					moves.push(new Move(from, target, 'normal'));
				} else {
					if (canTarget(target)) {
						moves.push(new Move(from, target, 'normal'));
					}
					break;
				}
				x += dx;
				y += dy;
			}
		}

		return moves;
	}

	/** Бьёт ли клетка по лучу в одном из направлений. */
	static canAttack(from: Cell, target: Cell, directions: Direction[]): boolean {
		for (const [dx, dy] of directions) {
			if (!this.isTargetOnRay(from, target, dx, dy)) continue;
			if (this.isRayClear(from, target, dx, dy)) return true;
		}
		return false;
	}

	private static isTargetOnRay(from: Cell, target: Cell, dx: number, dy: number): boolean {
		const offsetX = target.x - from.x;
		const offsetY = target.y - from.y;
		if (offsetX === 0 && offsetY === 0) return false;

		const stepsX = dx === 0 ? 0 : offsetX / dx;
		const stepsY = dy === 0 ? 0 : offsetY / dy;

		if (dx !== 0 && offsetX % dx !== 0) return false;
		if (dy !== 0 && offsetY % dy !== 0) return false;
		if (dx !== 0 && dy !== 0 && stepsX !== stepsY) return false;
		if (dx !== 0 && stepsX <= 0) return false;
		if (dy !== 0 && stepsY <= 0) return false;

		return true;
	}

	private static isRayClear(from: Cell, target: Cell, dx: number, dy: number): boolean {
		let x = from.x + dx;
		let y = from.y + dy;

		while (x !== target.x || y !== target.y) {
			if (!from.board.getCell(x, y).isEmpty()) return false;
			x += dx;
			y += dy;
		}

		return true;
	}
}
