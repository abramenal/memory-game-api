import createService, { UsersService } from './users';

describe('Users service', () => {
  let service: UsersService;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    service = createService({ logger: console });
  });

  describe('createUser', () => {
    it.todo('creates a new user');
  });

  describe('getUser', () => {
    it.todo('throws if user is not found');
    it.todo('returns user info');
  });

  describe('getGamesHistory', () => {
    it.todo('returns games history');
  });
});
