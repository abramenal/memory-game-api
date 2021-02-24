import mockKnex from 'mock-knex';

import createService, { GamesService } from './games';

import mockGame from './__mocks__/game.json';

const tracker = mockKnex.getTracker();

describe('Games service', () => {
  let service: GamesService;

  beforeEach(() => {
    service = createService({ logger: console });
    tracker.install();
  });
  afterEach(() => tracker.uninstall());

  describe('createGame', () => {
    it('creates a new game', async done => {
      tracker.once('query', query => {
        expect(query.method).toEqual('insert');
        query.response([mockGame]);
        done();
      });

      const created = await service.createGame({ turnsAmount: 4, userId: 'userId' });

      expect(created).toEqual(
        expect.objectContaining({
          status: 'started',
          sequence: '15,20,24,8',
          currentTurn: 0,
          turnsTotal: 4,
        }),
      );
    });
  });

  describe('submitGameTurn', () => {
    it.todo('throws when game is not found');
    it.todo('throws when game is not started');

    describe('When given turn is incorrect', () => {
      it.todo('stores a record about turn history');
      it.todo('finishes the game');
    });

    describe('When given turn is correct and is not the last', () => {
      it.todo('stores a record about turn history');
      it.todo('updates current turn value');
    });

    describe('When given turn is correct and is the last', () => {
      it.todo('stores a record about turn history');
      it.todo('finishes the game');
    });
  });
});
