import knex from '../db/connection';
import { Game, GameTurn } from '../types';

import { TURN_MAX_INTEGER } from '../constants';
import { getRandomInt } from '../helpers';
import { Logger } from '../logger';

const orderSequence = (sequence: number[]) => sequence.map(v => v).sort((a, b) => a - b);
const generateGameSequence = (turnsAmount: number) => {
  const sequence: number[] = [];
  let retry = 0;
  const MAX_RETRIES = turnsAmount * 5;

  while (sequence.length < turnsAmount || retry < MAX_RETRIES) {
    const r = getRandomInt(TURN_MAX_INTEGER);
    if (sequence.indexOf(r) === -1) {
      sequence.push(r);
    }

    retry += 1;
  }

  return sequence;
};

type CreateGamePayload = {
  turnsAmount: number;
  userId: string;
};

type SubmitGameTurnPayload = {
  value: number;
  gameId: string;
  userId: string;
};

export type GamesService = {
  createGame: (payload: CreateGamePayload) => Promise<Partial<Game>>;
  submitGameTurn: (payload: SubmitGameTurnPayload) => Promise<Partial<Game>>;
};

type ServiceDependencies = {
  logger: Logger;
};

export default function createService({ logger }: ServiceDependencies): GamesService {
  const createGame = async ({ turnsAmount, userId }: CreateGamePayload) => {
    const sequence = generateGameSequence(turnsAmount);
    const sequenceOrdered = orderSequence(sequence);

    const columnInfo = await knex('games').columnInfo();
    const columns = Object.keys(columnInfo);

    const game = await knex<Game>('games')
      .insert({
        status: 'started',
        sequence: sequenceOrdered,
        currentTurn: 0,
        turnsTotal: turnsAmount,
        userId,
      })
      .returning(columns);

    return {
      ...game[0],
      sequence, // expose only unordered
    };
  };

  const submitGameTurn = async ({ gameId, userId, value }: SubmitGameTurnPayload) =>
    knex.transaction(async trx => {
      const game = await knex<Game>('games').where('id', gameId).where('user_id', userId).first();
      const columnInfo = await knex('games').columnInfo();
      const columns = Object.keys(columnInfo);

      if (!game) {
        const message = 'Cannot find game with given attributes';
        logger.info(message);

        throw new Error(message);
      }

      if (game.status !== 'started') {
        const message = 'Cannot submit game turn. Game must be started';
        logger.info(message);

        throw new Error(message);
      }

      await knex<GameTurn>('game_turns')
        .insert({
          value,
          gameId,
        })
        .transacting(trx);

      const correctTurnValue = game.sequence[game.currentTurn];

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
        .where('id', gameId)
        .where('user_id', userId)
        .update(fieldsToUpdate)
        .returning(columns)
        .transacting(trx);

      return updatedGame[0];
    });

  return {
    createGame,
    submitGameTurn,
  };
}
