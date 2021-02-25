import createService, { UsersService } from './users';

describe('Users service', () => {
  let service: UsersService;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    service = createService({ logger: console });
  });

  describe('login', () => {
    it.todo('creates a new user if it is not existing');
    it.todo('retrieves existing user info');
  });

  describe('getGamesHistory', () => {
    it.todo('returns games history');
  });
});
