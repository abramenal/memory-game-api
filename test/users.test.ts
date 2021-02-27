import request from 'supertest';

import connection from '../src/db/connection';
import createApp from '../src/app';
import createServices from '../src/services';
import logger from './__mocks__/logger';

const services = createServices({ logger });

const app = createApp({ logger, services }, { useHTTPLogger: false });

describe('/users', () => {
  afterAll(() => {
    connection.destroy();
  });

  describe('POST /login', () => {
    it('throws if "username" is missing', done => {
      request(app)
        .post('/users/login')
        .send({ user: 'abramenal' })
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Error validating request body. "username" is required. "user" is not allowed.');

          return done();
        });
    });

    it('return existing user', done => {
      request(app)
        .post('/users/login')
        .send({ username: 'test' })
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual('test');
          done();
        })
        .catch(err => done(err));
    });

    it('return a new user', done => {
      request(app)
        .post('/users/login')
        .send({ username: 'abramenal' })
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual('abramenal');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('GET /:userId/history', () => {
    const userId = '1b059374-dc5a-4552-86b1-b807a0ac2734';
    const gameId = 'a6321738-f691-4adc-968e-a60b42276fd7';

    it('returns user games history', done => {
      request(app)
        .get(`/users/${userId}/history`)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body).toEqual([
            expect.objectContaining({
              currentTurn: 4,
              sequence: [1, 2, 3, 4],
              status: 'completed',
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
              turnsTotal: 4,
              userId,
            }),
          ]);

          done();
        })
        .catch(err => done(err));
    });
  });
});
