import { useCallback, useState } from 'react';
import { BOARD_SIZE } from '../chess/constants';

interface BoardFocus {
	x: number;
	y: number;
}

/** Управляет фокусом и клавиатурной навигацией по доске. */
export function useBoardKeyboard(onActivate: (focus: BoardFocus) => void) {
	const [focus, setFocus] = useState<BoardFocus>({ x: 0, y: 0 });

	const moveFocus = useCallback((dx: number, dy: number) => {
		setFocus((current) => ({
			x: Math.min(BOARD_SIZE - 1, Math.max(0, current.x + dx)),
			y: Math.min(BOARD_SIZE - 1, Math.max(0, current.y + dy)),
		}));
	}, []);

	const handleBoardKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			switch (event.key) {
				case 'ArrowUp':
					moveFocus(0, -1);
					event.preventDefault();
					break;
				case 'ArrowDown':
					moveFocus(0, 1);
					event.preventDefault();
					break;
				case 'ArrowLeft':
					moveFocus(-1, 0);
					event.preventDefault();
					break;
				case 'ArrowRight':
					moveFocus(1, 0);
					event.preventDefault();
					break;
				case 'Enter':
				case ' ':
					onActivate(focus);
					event.preventDefault();
					break;
				default:
					break;
			}
		},
		[focus, moveFocus, onActivate],
	);

	return { focus, handleBoardKeyDown };
}
