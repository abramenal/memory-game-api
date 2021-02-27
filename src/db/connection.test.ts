import connection from './connection';

jest.mock('knex', () => (config: Record<string, unknown>) => config);
jest.mock('../bootstrap', () => ({
  POSTGRES_HOST: 'POSTGRES_HOST',
  POSTGRES_PORT: 'POSTGRES_PORT',
  POSTGRES_USER: 'POSTGRES_USER',
  POSTGRES_PASSWORD: 'POSTGRES_PASSWORD',
  POSTGRES_DB: 'POSTGRES_DB',
  NODE_ENV: 'NODE_ENV',
}));

describe('connection', () => {
  it('matches the snapshot', () => {
    expect(connection).toMatchSnapshot();
  });
});
