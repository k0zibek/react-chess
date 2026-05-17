import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { ChessGame } from '../chess/ChessGame';
import { Cell } from '../chess/board/Cell';
import { Colors, FigureNames, GameStatus } from '../chess/types';
import { Move } from '../chess/Move';

type ChessUiState = {
	game: ChessGame;
	version: number;
};

type ChessUiAction = { type: 'TICK' } | { type: 'RESTART' };

/** Триггер re-render после мутации мутабельной позиции. */
function chessUiReducer(state: ChessUiState, action: ChessUiAction): ChessUiState {
	switch (action.type) {
		case 'TICK':
			return { ...state, version: state.version + 1 };
		case 'RESTART':
			state.game.restart();
			return { ...state, version: state.version + 1 };
		default:
			return state;
	}
}

/** Управляет партией, выбором клеток и применением ходов. */
export function useChessGame() {
	const [{ game, version }, dispatch] = useReducer(chessUiReducer, undefined, () => ({
		game: ChessGame.createInitial(),
		version: 0,
	}));

	const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
	const [legalMoves, setLegalMoves] = useState<Move[]>([]);
	const [pendingPromotionMoves, setPendingPromotionMoves] = useState<Move[] | null>(null);
	const [timeWinner, setTimeWinner] = useState<Colors | null>(null);

	const snapshot = game.getSnapshot();
	const isGameOver =
		snapshot.status === GameStatus.CHECKMATE ||
		snapshot.status === GameStatus.STALEMATE ||
		timeWinner !== null;

	const availableKeys = useMemo(
		() => new Set(legalMoves.map((move) => `${move.to.x}-${move.to.y}`)),
		[legalMoves],
	);

	useEffect(() => {
		if (!selectedCell || isGameOver) {
			setLegalMoves([]);
			return;
		}
		setLegalMoves(game.selectLegalMoves(selectedCell));
	}, [selectedCell, isGameOver, game, version]);

	const playMove = useCallback(
		(move: Move) => {
			if (!game.playMove(move)) return;

			dispatch({ type: 'TICK' });
			setSelectedCell(null);
			setLegalMoves([]);
			setPendingPromotionMoves(null);
		},
		[game],
	);

	const click = useCallback(
		(cell: Cell) => {
			if (isGameOver) return;

			if (selectedCell && selectedCell !== cell) {
				const matching = legalMoves.filter((move) => move.to === cell);
				if (matching.length === 0) {
					setSelectedCell(
						cell.figure?.color === snapshot.currentTurn ? cell : null,
					);
					return;
				}

				const promotionMoves = matching.filter((move) => move.type === 'promotion');
				if (promotionMoves.length > 0) {
					setPendingPromotionMoves(promotionMoves);
					return;
				}

				playMove(matching[0]);
				return;
			}

			setSelectedCell(cell.figure?.color === snapshot.currentTurn ? cell : null);
		},
		[selectedCell, isGameOver, legalMoves, playMove, snapshot.currentTurn],
	);

	const handlePromotionSelect = useCallback(
		(piece: FigureNames) => {
			const move = pendingPromotionMoves?.find((m) => m.promotionPiece === piece);
			if (move) playMove(move);
		},
		[pendingPromotionMoves, playMove],
	);

	const isCellAvailable = useCallback(
		(cell: Cell) => availableKeys.has(`${cell.x}-${cell.y}`),
		[availableKeys],
	);

	const handleTimeExpired = useCallback((loser: Colors) => {
		setTimeWinner(loser === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
	}, []);

	const restart = useCallback(() => {
		dispatch({ type: 'RESTART' });
		setSelectedCell(null);
		setLegalMoves([]);
		setPendingPromotionMoves(null);
		setTimeWinner(null);
	}, []);

	const promotionColor = pendingPromotionMoves?.[0]?.from.figure?.color ?? null;

	return {
		game,
		version,
		snapshot,
		selectedCell,
		pendingPromotionMoves,
		promotionColor,
		isGameOver,
		timeWinner,
		isCellAvailable,
		click,
		handlePromotionSelect,
		handleTimeExpired,
		restart,
	};
}
