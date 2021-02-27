import knex from '../db/connection';
import { GameHistory, GameStatus, User } from '../types';
import { Logger } from '../logger';

type CreateOrGetUserPayload = {
  username: string;
};

type GetGamesHistoryPayload = {
  userId: string;
};

export type UsersService = {
  login: (payload: CreateOrGetUserPayload) => Promise<User>;
  getGamesHistory: (payload: GetGamesHistoryPayload) => Promise<GameHistory[]>;
};

type ServiceDependencies = {
  logger: Logger;
};

export default function createService({ logger }: ServiceDependencies): UsersService {
  const login = async ({ username }: CreateOrGetUserPayload) => {
    const columnInfo = await knex('users').columnInfo();
    const columns = Object.keys(columnInfo);

    const found = await knex<User>('users').where('username', username).first();

    if (found) {
      return found;
    }

    logger.info(`Creating a new user ${username}`);

    const res = await knex<User>('users')
      .insert({
        username,
      })
      .returning(columns);

    return res[0] as User;
  };

  type GameHistoryRecord = {
    id: string;
    status: GameStatus;
    sequence: number[];
    currentTurn: number;
    turnsTotal: number;
    userId: string;
    createdAt: string;
    turnId: string;
    turnValue: number;
    turnCreatedAt: string;
  };

  const getGamesHistory = async ({ userId }: GetGamesHistoryPayload): Promise<GameHistory[]> => {
    const res = await knex<GameHistoryRecord>('games')
      .where('user_id', userId)
      .join('game_turns', 'games.id', 'game_turns.game_id')
      .select({
        id: 'games.id',
        status: 'games.status',
        sequence: 'games.sequence',
        currentTurn: 'games.currentTurn',
        turnsTotal: 'games.turnsTotal',
        userId: 'games.userId',
        createdAt: 'games.createdAt',
        turnId: 'game_turns.id',
        turnValue: 'game_turns.value',
        turnCreatedAt: 'game_turns.createdAt',
      })
      .orderBy([
        { column: 'games.createdAt', order: 'DESC' },
        { column: 'game_turns.createdAt', order: 'ASC' },
      ]);

    const mapped = res.reduce((acc: { [key: string]: GameHistory }, item: GameHistoryRecord) => {
      const { id, status, sequence, currentTurn, turnsTotal, createdAt, ...turn } = item;
      const { turnId, turnValue, turnCreatedAt } = turn;

      const turnEntity = {
        id: turnId,
        value: turnValue,
        userId,
        gameId: id,
        createdAt: turnCreatedAt,
      };

      if (!acc[id]) {
        acc[id] = {
          id,
          userId,
          status,
          sequence,
          currentTurn,
          turnsTotal,
          createdAt,
          turns: [turnEntity],
        };
      } else {
        acc[id].turns.push(turnEntity);
      }

      return acc;
    }, {});

    return Object.values(mapped);
  };

  return {
    login,
    getGamesHistory,
  };
}
