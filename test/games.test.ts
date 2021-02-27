import request from 'supertest';

import connection from '../src/db/connection';
import createApp from '../src/app';
import createServices from '../src/services';
import logger from './__mocks__/logger';

const services = createServices({ logger });

const app = createApp({ logger, services }, { useHTTPLogger: false });

describe('/games', () => {
  afterAll(() => {
    connection.destroy();
  });

  describe('POST /', () => {
    const userId = '1b059374-dc5a-4552-86b1-b807a0ac2734';

    it('throws if "userId" is missing', done => {
      request(app)
        .post('/games')
        .send({ userId: null, turnsAmount: 4 })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Error validating request body. "userId" must be a string.');

          return done();
        });
    });

    it('throws if "turnsAmount" is missing', done => {
      request(app)
        .post('/games')
        .send({ userId, turnsAmount: null })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Error validating request body. "turnsAmount" must be a number.');

          return done();
        });
    });

    it('creates a new game', done => {
      request(app)
        .post('/games')
        .send({ userId, turnsAmount: 4 })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(
            expect.objectContaining({
              status: 'started',
              currentTurn: 0,
              userId,
              turnsTotal: 4,
            }),
          );

          return done();
        });
    });
  });

  describe('POST /:gameId/turn', () => {
    const gameId = '78b6aebc-9116-44bf-95e4-b99e5bfa7aec';
    const userId = 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc';

    it('throws if "userId" is missing', done => {
      request(app)
        .post(`/games/${gameId}/turn`)
        .send({ userId: null, value: 4 })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Error validating request body. "userId" must be a string.');

          return done();
        });
    });

    it('throws if "userId" is missing', done => {
      request(app)
        .post(`/games/${gameId}/turn`)
        .send({ userId, value: null })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Error validating request body. "value" must be a number.');

          return done();
        });
    });

    describe('finishes the game successfully', () => {
      [
        { value: 6, currentTurn: 1, status: 'started' },
        { value: 7, currentTurn: 2, status: 'started' },
        { value: 8, currentTurn: 3, status: 'started' },
        { value: 9, currentTurn: 4, status: 'completed' },
      ].forEach(({ value, currentTurn, status }) => {
        it(`updates game entity with turn results of "${value}"`, done => {
          request(app)
            .post(`/games/${gameId}/turn`)
            .send({ userId, value })
            .set('Accept', 'application/json')
            .end((err, res) => {
              expect(res.status).toEqual(200);

              expect(res.body).toEqual(
                expect.objectContaining({
                  status,
                  currentTurn,
                  userId,
                  turnsTotal: 4,
                }),
              );

              return done();
            });
        });
      });
    });

    describe('fails to finish the game', () => {
      const gameIdToFail = '9441ed8e-c82a-4cdc-9f1c-7f2fb73d3c11';

      it(`updates game entity with turn results of "30"`, done => {
        request(app)
          .post(`/games/${gameIdToFail}/turn`)
          .send({ userId, value: 30 })
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(res.status).toEqual(200);

            expect(res.body).toEqual(
              expect.objectContaining({
                status: 'failed',
                currentTurn: 3,
                userId,
                turnsTotal: 4,
              }),
            );

            return done();
          });
      });
    });
  });
});
