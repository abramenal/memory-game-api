import express from 'express';

import { AppServices } from '../services';
import { Logger } from '../logger';

type UsersRouterDependencies = {
  services: AppServices;
  logger: Logger;
};

export default function createUsersRouter({ services: { users } }: UsersRouterDependencies) {
  const usersRouter = express.Router();

  usersRouter.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
      const user = await users.getUser({ username });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  usersRouter.post('/', async (req, res) => {
    const { username } = req.body;

    try {
      const user = await users.createUser({ username });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  usersRouter.get('/:userId/history', async (req, res) => {
    const { userId } = req.params;

    try {
      const history = await users.getGamesHistory({ userId });

      res.status(200).send(history);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  return usersRouter;
}
