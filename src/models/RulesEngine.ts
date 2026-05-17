import { Board } from './Board';
import { forEachCell } from './boardUtils';
import { Cell } from './Cell';
import { getOpponent } from './constants';
import { Colors } from './Colors';
import { FigureNames } from './FigureNames';
import { GameState } from './GameState';
import { GameStatus } from './GameStatus';
import { Move } from './Move';

/** Движок правил: атака, легальность ходов и статус партии. */
export class RulesEngine {
	static isSquareAttacked(board: Board, x: number, y: number, byColor: Colors): boolean {
		const target = board.getCell(x, y);
		let attacked = false;
		forEachCell(board, (cell) => {
			if (attacked) return;
			const figure = cell.figure;
			if (figure && figure.color === byColor && figure.canAttackSquare(target)) {
				attacked = true;
			}
		});
		return attacked;
	}

	static findKing(board: Board, color: Colors): Cell | null {
		let kingCell: Cell | null = null;
		forEachCell(board, (cell) => {
			if (cell.figure?.name === FigureNames.KING && cell.figure.color === color) {
				kingCell = cell;
			}
		});
		return kingCell;
	}

	static isKingInCheck(state: GameState, color: Colors): boolean {
		const kingCell = this.findKing(state.board, color);
		if (!kingCell) return false;
		return this.isSquareAttacked(
			state.board,
			kingCell.x,
			kingCell.y,
			getOpponent(color),
		);
	}

	static getPseudoLegalMoves(state: GameState, cell: Cell): Move[] {
		return cell.figure?.getPseudoLegalMoves(state) ?? [];
	}

	static isLegalMove(state: GameState, move: Move): boolean {
		return this.getLegalMoves(state, move.from).some((legal) => legal.matches(move));
	}

	static getLegalMoves(state: GameState, cell: Cell, forColor?: Colors): Move[] {
		const color = forColor ?? state.currentTurn;
		if (!cell.figure || cell.figure.color !== color) return [];

		const moverColor = cell.figure.color;
		return this.getPseudoLegalMoves(state, cell).filter((move) => {
			if (!this.isCastlingMoveLegal(state, move, moverColor)) return false;
			const record = state.applyMove(move);
			const legal = !this.isKingInCheck(state, moverColor);
			state.undoMove(record);
			return legal;
		});
	}

	static getAllLegalMoves(state: GameState, color: Colors): Move[] {
		const moves: Move[] = [];
		forEachCell(state.board, (cell) => {
			if (cell.figure?.color === color) {
				moves.push(...this.getLegalMoves(state, cell, color));
			}
		});
		return moves;
	}

	static updateGameStatus(state: GameState): void {
		if (state.status === GameStatus.CHECKMATE || state.status === GameStatus.STALEMATE) {
			return;
		}

		const inCheck = this.isKingInCheck(state, state.currentTurn);
		const legalMoves = this.getAllLegalMoves(state, state.currentTurn);

		if (legalMoves.length === 0) {
			state.status = inCheck ? GameStatus.CHECKMATE : GameStatus.STALEMATE;
		} else if (inCheck) {
			state.status = GameStatus.CHECK;
		} else {
			state.status = GameStatus.ONGOING;
		}
	}

	private static isCastlingMoveLegal(state: GameState, move: Move, color: Colors): boolean {
		if (move.type !== 'castle') return true;
		if (this.isKingInCheck(state, color)) return false;

		const attacker = getOpponent(color);
		const dx = move.to.x - move.from.x;
		const step = dx > 0 ? 1 : -1;

		for (let x = move.from.x; x !== move.to.x + step; x += step) {
			if (x !== move.from.x && this.isSquareAttacked(state.board, x, move.from.y, attacker)) {
				return false;
			}
		}
		return true;
	}
}
