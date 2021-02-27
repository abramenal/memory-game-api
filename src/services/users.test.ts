import createService, { UsersService } from './users';
import knex from '../db/connection';
import logger from '../__mocks__/logger';

describe('Users service', () => {
  let service: UsersService;

  beforeEach(() => {
    service = createService({ logger });
  });

  afterAll(() => knex.destroy());

  describe('login', () => {
    it('creates a new user if it is not existing', async () => {
      const username = 'yolo';
      const expected = expect.objectContaining({
        username,
      });

      const existing = await knex('users').where('username', username).first();
      expect(existing).toEqual(undefined);

      const res = await service.login({ username });
      expect(res).toEqual(expected);

      const updated = await knex('users').where('username', username).first();
      expect(updated).toEqual(expected);
    });

    it('retrieves existing user info', async () => {
      const username = 'test';
      const expected = expect.objectContaining({
        username,
      });

      const existing = await knex('users').where('username', username).first();
      expect(existing).toEqual(expected);

      const res = await service.login({ username });
      expect(res).toEqual(expected);
    });
  });

  describe('getGamesHistory', () => {
    it('returns games history', async () => {
      const userId = '1b059374-dc5a-4552-86b1-b807a0ac2734';
      const gameId = 'a6321738-f691-4adc-968e-a60b42276fd7';

      const res = await service.getGamesHistory({ userId });
      expect(res).toEqual([
        expect.objectContaining({
          userId,
          status: 'completed',
          sequence: [1, 2, 3, 4],
          currentTurn: 4,
          turnsTotal: 4,
          turns: expect.arrayContaining([
            expect.objectContaining({
              gameId,
              userId,
              value: 1,
            }),
            expect.objectContaining({
              gameId,
              userId,
              value: 2,
            }),
            expect.objectContaining({
              gameId,
              userId,
              value: 3,
            }),
            expect.objectContaining({
              gameId,
              userId,
              value: 4,
            }),
          ]),
        }),
      ]);
    });
  });
});
