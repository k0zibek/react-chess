import { MoveType } from '../types';
import { castleHandler } from './handlers/castleHandler';
import { enPassantHandler } from './handlers/enPassantHandler';
import { MoveHandler } from './handlers/MoveHandler';
import { normalHandler } from './handlers/normalHandler';
import { promotionHandler } from './handlers/promotionHandler';

/** Реестр обработчиков по типу хода. */
export const moveHandlers: Record<MoveType, MoveHandler> = {
	normal: normalHandler,
	castle: castleHandler,
	enPassant: enPassantHandler,
	promotion: promotionHandler,
};
