import request from 'supertest';

import connection from '../src/db/connection';
import createApp from '../src/app';
import createServices from '../src/services';

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const services = createServices({ logger });

const app = createApp({ logger, services });

describe('/users', () => {
  afterAll(() => {
    connection.destroy();
  });

  describe('POST /', () => {
    it('throws if "username" is missing', done => {
      request(app)
        .post('/users')
        .send({ user: 'abramenal' })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.text).toEqual('Error validating request body. "username" is required. "user" is not allowed.');

          return done();
        });
    });

    it('return a new user', done => {
      request(app)
        .post('/users')
        .send({ username: 'abramenal' })
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body.username).toEqual('abramenal');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('GET /:userId/history', () => {
    it('returns user games history', done => {
      request(app)
        .get('/users/1b059374-dc5a-4552-86b1-b807a0ac2734/history')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ value: '1', status: 'completed' }),
              expect.objectContaining({ value: '2', status: 'completed' }),
              expect.objectContaining({ value: '3', status: 'completed' }),
              expect.objectContaining({ value: '4', status: 'completed' }),
            ]),
          );
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('GET /:username', () => {
    it('returns user by username', done => {
      request(app)
        .get('/users/test')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining({
              username: 'test',
            }),
          );
          done();
        })
        .catch(err => done(err));
    });
  });
});
