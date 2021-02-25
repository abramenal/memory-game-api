import knex from '../db/connection';
import { Game, GameTurn, User } from '../types';
import { Logger } from '../logger';

type CreateOrGetUserPayload = {
  username: string;
};

type GetGamesHistoryPayload = {
  userId: string;
};

export type UsersService = {
  login: (payload: CreateOrGetUserPayload) => Promise<User>;
  getGamesHistory: (payload: GetGamesHistoryPayload) => Promise<(Game & GameTurn)[]>;
};

type ServiceDependencies = {
  logger: Logger;
};

export default function createService({ logger }: ServiceDependencies): UsersService {
  const login = async ({ username }: CreateOrGetUserPayload): Promise<User> => {
    const found = await knex<User>('users').where('username', username).first();

    if (found) {
      return found;
    }

    logger.info(`Creating a new user ${username}`);

    const res = await knex<User>('users')
      .insert({
        username,
      })
      .returning(['id', 'username', 'createdAt', 'updatedAt']);
    return res[0];
  };

  const getGamesHistory = async ({ userId }: GetGamesHistoryPayload): Promise<(Game & GameTurn)[]> =>
    knex<Game>('games')
      .where('user_id', userId)
      .join('game_turns', 'games.id', 'game_turns.game_id')
      .select(['game_turns.id', 'game_turns.value', 'game_turns.game_id', 'games.user_id', 'games.status']);

  return {
    login,
    getGamesHistory,
  };
}
