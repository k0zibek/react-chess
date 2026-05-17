/** Геометрия одной стороны рокировки. */
export interface CastlingSideConfig {
	kingToX: number;
	rookFromX: number;
	rookToX: number;
	emptyX: number[];
}

export const CASTLING_SIDES = {
	kingside: { kingToX: 6, rookFromX: 7, rookToX: 5, emptyX: [5, 6] },
	queenside: { kingToX: 2, rookFromX: 0, rookToX: 3, emptyX: [1, 2, 3] },
} as const satisfies Record<string, CastlingSideConfig>;

export type CastlingSide = keyof typeof CASTLING_SIDES;
