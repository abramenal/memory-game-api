import knex from '../db/connection';
import { Game, GameTurn, User } from '../types';
import { Logger } from '../logger';

type CreateUserPayload = {
  username: string;
};

type GetUserPayload = {
  username: string;
};

type GetGamesHistoryPayload = {
  userId: string;
};

export type UsersService = {
  createUser: (payload: CreateUserPayload) => Promise<User>;
  getUser: (payload: GetUserPayload) => Promise<User>;
  getGamesHistory: (payload: GetGamesHistoryPayload) => Promise<(Game & GameTurn)[]>;
};

type ServiceDependencies = {
  logger: Logger;
};

export default function createService({ logger }: ServiceDependencies): UsersService {
  const createUser = async ({ username }: CreateUserPayload): Promise<User> => {
    const res = await knex<User>('users')
      .insert({
        username,
      })
      .returning(['id', 'username', 'createdAt', 'updatedAt']);

    return res[0];
  };

  const getUser = async ({ username }: GetUserPayload): Promise<User> => {
    const res = await knex<User>('users').where({ username }).first();

    if (!res) {
      const message = `Cannot find user "${username}"`;
      logger.info(message);

      throw new Error(message);
    }

    return res;
  };

  const getGamesHistory = async ({ userId }: GetGamesHistoryPayload): Promise<(Game & GameTurn)[]> =>
    knex<Game>('games')
      .where('user_id', userId)
      .join('game_turns', 'games.id', 'game_turns.game_id')
      .select(['game_turns.id', 'game_turns.value', 'game_turns.game_id', 'games.user_id', 'games.status']);

  return {
    createUser,
    getUser,
    getGamesHistory,
  };
}
