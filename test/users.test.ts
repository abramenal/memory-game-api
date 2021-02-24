import request from 'supertest';

import createApp from '../src/app';
import createServices from '../src/services';

const logger = console;

const services = createServices({ logger });

const app = createApp({ logger, services });

describe('/users', () => {
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

    it.todo('return a new user');
  });
});
