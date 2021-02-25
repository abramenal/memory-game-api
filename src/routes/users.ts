import express from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';

import {
  CreateUserPayloadSchema,
  CreateUserRequest,
  GetUserHistoryParamsSchema,
  GetUserHistoryRequest,
} from './schema/users';

import { AppServices } from '../services';
import { Logger } from '../logger';

type UsersRouterDependencies = {
  services: AppServices;
  logger: Logger;
};

export default function createUsersRouter({ services: { users } }: UsersRouterDependencies) {
  const usersRouter = express.Router();
  const validator = createValidator();

  usersRouter.post(
    '/login',
    validator.body(CreateUserPayloadSchema),
    async (req: ValidatedRequest<CreateUserRequest>, res) => {
      const { username } = req.body;

      try {
        const user = await users.login({ username });

        res.status(200).send(user);
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    },
  );

  usersRouter.get(
    '/:userId/history',
    validator.params(GetUserHistoryParamsSchema),
    async (req: ValidatedRequest<GetUserHistoryRequest>, res) => {
      const { userId } = req.params;

      try {
        const history = await users.getGamesHistory({ userId });

        res.status(200).send(history);
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    },
  );

  return usersRouter;
}
