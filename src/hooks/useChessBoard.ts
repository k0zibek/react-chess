import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cell } from '../models/Cell';
import { FigureNames } from '../models/FigureNames';
import { GameState } from '../models/GameState';
import { GameStatus } from '../models/GameStatus';
import { Move } from '../models/Move';
import { RulesEngine } from '../models/RulesEngine';

/** Управляет выбором клеток, подсветкой и применением ходов. */
export function useChessBoard(
	gameState: GameState,
	setGameState: (state: GameState) => void,
) {
	const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
	const [legalMoves, setLegalMoves] = useState<Move[]>([]);
	const [pendingPromotionMoves, setPendingPromotionMoves] = useState<Move[] | null>(null);
	const stateRef = useRef(gameState);
	stateRef.current = gameState;

	const isGameOver =
		gameState.status === GameStatus.CHECKMATE ||
		gameState.status === GameStatus.STALEMATE;

	const availableKeys = useMemo(
		() => new Set(legalMoves.map((move) => `${move.to.x}-${move.to.y}`)),
		[legalMoves],
	);

	useEffect(() => {
		if (!selectedCell || isGameOver) {
			setLegalMoves([]);
			return;
		}
		setLegalMoves(RulesEngine.getLegalMoves(stateRef.current, selectedCell));
	}, [selectedCell, isGameOver, gameState]);

	const playTurn = useCallback(
		(move: Move) => {
			const state = stateRef.current;
			if (!state.playTurn(move)) return;

			setGameState(state.cloneBoardShell());
			setSelectedCell(null);
			setLegalMoves([]);
			setPendingPromotionMoves(null);
		},
		[setGameState],
	);

	const click = useCallback(
		(cell: Cell) => {
			if (isGameOver) return;
			const state = stateRef.current;

			if (selectedCell && selectedCell !== cell) {
				const matching = legalMoves.filter((move) => move.to === cell);
				if (matching.length === 0) {
					setSelectedCell(cell.figure?.color === state.currentTurn ? cell : null);
					return;
				}

				const promotionMoves = matching.filter((move) => move.type === 'promotion');
				if (promotionMoves.length > 0) {
					setPendingPromotionMoves(promotionMoves);
					return;
				}

				playTurn(matching[0]);
				return;
			}

			setSelectedCell(cell.figure?.color === state.currentTurn ? cell : null);
		},
		[selectedCell, isGameOver, legalMoves, playTurn],
	);

	const handlePromotionSelect = useCallback(
		(piece: FigureNames) => {
			const move = pendingPromotionMoves?.find((m) => m.promotionPiece === piece);
			if (move) playTurn(move);
		},
		[pendingPromotionMoves, playTurn],
	);

	const isCellAvailable = useCallback(
		(cell: Cell) => availableKeys.has(`${cell.x}-${cell.y}`),
		[availableKeys],
	);

	return {
		selectedCell,
		pendingPromotionMoves,
		isGameOver,
		isCellAvailable,
		click,
		handlePromotionSelect,
	};
}
