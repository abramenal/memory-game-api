import knex from '../db/connection';
import createService, { GamesService } from './games';
import logger from '../../test/__mocks__/logger';

describe('Games service', () => {
  let service: GamesService;

  beforeEach(() => {
    service = createService({ logger });
  });

  afterAll(() => knex.destroy());

  describe('createGame', () => {
    it('creates a new game', async () => {
      const created = await service.createGame({ turnsAmount: 4, userId: '1b059374-dc5a-4552-86b1-b807a0ac2734' });

      expect(created).toEqual(
        expect.objectContaining({
          status: 'started',
          currentTurn: 0,
          turnsTotal: 4,
        }),
      );
    });
  });

  describe('submitGameTurn', () => {
    it('throws when game is not found', async () => {
      const res = service.submitGameTurn({
        value: 4,
        gameId: '1b059374-dc5a-4552-86b1-b807a0ac2734',
        userId: '1b059374-dc5a-4552-86b1-b807a0ac2734',
      });

      expect(res).rejects.toThrowError('Cannot find game with given attributes');
    });

    it('throws when game is not started', async () => {
      const res = service.submitGameTurn({
        value: 4,
        gameId: 'a6321738-f691-4adc-968e-a60b42276fd7',
        userId: '1b059374-dc5a-4552-86b1-b807a0ac2734',
      });

      expect(res).rejects.toThrowError('Cannot submit game turn. Game must be started');
    });

    it('finishes the game if given turn is incorrect', async () => {
      const gameId = 'a2e919c1-882c-4ba7-b9c5-3f4ec58f1fa3';
      const userId = 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc';

      const res = await service.submitGameTurn({
        value: 7,
        gameId,
        userId,
      });

      expect(res.status).toEqual('failed');
      expect(res.sequence).toEqual([5, 20, 1, 4]);

      const turns = await knex('game_turns').where('game_id', gameId).select();

      expect(turns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 5 }),
          expect.objectContaining({ value: 20 }),
          expect.objectContaining({ value: 1 }),
          expect.objectContaining({ value: 7 }),
        ]),
      );
      expect(turns).toHaveLength(4);
    });

    it('continues the game if given turn is correct but not the final one', async () => {
      const gameId = '037d4554-51d4-4004-b6dd-5c772644c9cf';
      const userId = 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc';

      const res = await service.submitGameTurn({
        value: 6,
        gameId,
        userId,
      });

      expect(res.status).toEqual('started');
      expect(res.sequence).toEqual([6, 7, 8, 9]);
      expect(res.currentTurn).toEqual(1);

      const turns = await knex('game_turns').where('game_id', gameId).select();

      expect(turns).toEqual(expect.arrayContaining([expect.objectContaining({ value: 6 })]));
      expect(turns).toHaveLength(1);
    });

    it('finishes the game if given turn is correct and the final one', async () => {
      const gameId = '150d3a34-4346-49d0-a71c-7063a178bc50';
      const userId = 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc';

      const res = await service.submitGameTurn({
        value: 40,
        gameId,
        userId,
      });

      expect(res.status).toEqual('completed');
      expect(res.sequence).toEqual([10, 20, 30, 40]);

      const turns = await knex('game_turns').where('game_id', gameId).select();

      expect(turns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 10 }),
          expect.objectContaining({ value: 20 }),
          expect.objectContaining({ value: 30 }),
          expect.objectContaining({ value: 40 }),
        ]),
      );
      expect(turns).toHaveLength(4);
    });
  });
});
