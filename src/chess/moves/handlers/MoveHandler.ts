import { Move } from '../../Move';
import { MoveRecord } from '../../types';
import { Position } from '../../Position';

/** Контракт обработчика хода по типу. */
export interface MoveHandler {
	apply(position: Position, move: Move, record: MoveRecord): void;
	undo(position: Position, move: Move, record: MoveRecord): void;
}
