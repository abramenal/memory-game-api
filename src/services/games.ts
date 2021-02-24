import knex from '../db/connection';
import { Game, GameTurn } from '../types';

import { TURN_MAX_INTEGER } from '../constants';
import { getRandomInt } from '../helpers';

const GAME_SEQUENCE_SEPARATOR = ',';

const generateGameSequence = (turnsAmount: number) =>
  new Array(turnsAmount).fill(0).map(() => getRandomInt(TURN_MAX_INTEGER));

type CreateGamePayload = {
  turnsAmount: number;
  userId: string;
};

export const createGame = async ({ turnsAmount, userId }: CreateGamePayload) => {
  const sequence = generateGameSequence(turnsAmount);

  const game = await knex<Game>('games')
    .insert({
      status: 'started',
      sequence: sequence.join(GAME_SEQUENCE_SEPARATOR),
      currentTurn: 0,
      turnsTotal: turnsAmount,
      userId,
    })
    .returning('*');

  return game[0];
};

type SubmitGameTurnPayload = {
  value: string;
  gameId: string;
  userId: string;
};

export const submitGameTurn = async ({ gameId, userId, value }: SubmitGameTurnPayload) =>
  knex.transaction(async trx => {
    const game = await knex<Game>('games').where('game_id', gameId).where('user_id', userId).first();

    if (!game) {
      throw new Error('Cannot find game with given attributes');
    }

    if (game.status !== 'started') {
      throw new Error(`Cannot submit game turn. Game must be started`);
    }

    await knex<GameTurn>('game_turns')
      .insert({
        value,
        userId,
        gameId,
      })
      .transacting(trx);

    const sequence = game.sequence.split(GAME_SEQUENCE_SEPARATOR);
    const correctTurnValue = sequence[game.currentTurn];

    let fieldsToUpdate: Pick<Game, 'status' | 'currentTurn'>;

    if (correctTurnValue !== value) {
      fieldsToUpdate = {
        status: 'failed',
        currentTurn: game.currentTurn,
      };
    } else if (game.currentTurn + 1 === game.turnsTotal) {
      fieldsToUpdate = {
        status: 'completed',
        currentTurn: game.turnsTotal,
      };
    } else {
      fieldsToUpdate = {
        status: game.status,
        currentTurn: game.currentTurn + 1,
      };
    }

    const updatedGame = await knex<Game>('games')
      .where('game_id', gameId)
      .where('user_id', userId)
      .update(fieldsToUpdate)
      .returning('*')
      .transacting(trx);

    return updatedGame;
  });

type GetGamesHistoryPayload = {
  userId: string;
};

export const getGamesHistory = async ({ userId }: GetGamesHistoryPayload): Promise<Game[]> =>
  knex<Game>('games').where('user_id', userId).select('*');
