import express from 'express';

import { AppServices } from '../services';
import { Logger } from '../logger';

type GamesRouterDependencies = {
  services: AppServices;
  logger: Logger;
};

export default function createGamesRouter({ services: { games } }: GamesRouterDependencies) {
  const gamesRouter = express.Router();

  gamesRouter.post('/', async (req, res) => {
    const { userId, turnsAmount } = req.body;

    try {
      const user = await games.createGame({ userId, turnsAmount });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  gamesRouter.post('/:gameId/turn', async (req, res) => {
    const { gameId } = req.params;
    const { userId, value } = req.body;

    try {
      const user = await games.submitGameTurn({ gameId, userId, value });

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

  return gamesRouter;
}
