import createGamesService, { GamesService } from './games';
import createUsersService, { UsersService } from './users';

import { Logger } from '../logger';

export type AppServices = {
  games: GamesService;
  users: UsersService;
};

export default function createAppServices({ logger }: { logger: Logger }): AppServices {
  return {
    games: createGamesService({ logger }),
    users: createUsersService({ logger }),
  };
}
