import { CastlingSide } from './constants';
import { Colors } from './types';

/** Права на рокировку для обеих сторон. */
export class CastlingRights {
	whiteKingside = true;
	whiteQueenside = true;
	blackKingside = true;
	blackQueenside = true;

	clone(): CastlingRights {
		const copy = new CastlingRights();
		copy.whiteKingside = this.whiteKingside;
		copy.whiteQueenside = this.whiteQueenside;
		copy.blackKingside = this.blackKingside;
		copy.blackQueenside = this.blackQueenside;
		return copy;
	}

	isAllowed(color: Colors, side: CastlingSide): boolean {
		if (color === Colors.WHITE) {
			return side === 'kingside' ? this.whiteKingside : this.whiteQueenside;
		}
		return side === 'kingside' ? this.blackKingside : this.blackQueenside;
	}

	revokeAll(color: Colors): void {
		if (color === Colors.WHITE) {
			this.whiteKingside = false;
			this.whiteQueenside = false;
		} else {
			this.blackKingside = false;
			this.blackQueenside = false;
		}
	}

	revokeRookSide(color: Colors, file: number, rank: number): void {
		const isWhiteHome = color === Colors.WHITE && rank === 7;
		const isBlackHome = color === Colors.BLACK && rank === 0;
		if (!isWhiteHome && !isBlackHome) return;

		if (file === 0) {
			color === Colors.WHITE ? (this.whiteQueenside = false) : (this.blackQueenside = false);
		}
		if (file === 7) {
			color === Colors.WHITE ? (this.whiteKingside = false) : (this.blackKingside = false);
		}
	}
}
