import express from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';

import {
  CreateGamePayloadSchema,
  CreateGameRequest,
  CreateTurnParamsSchema,
  CreateTurnPayloadSchema,
  CreateTurnRequest,
} from './schema/games';

import { AppServices } from '../services';
import { Logger } from '../logger';

type GamesRouterDependencies = {
  services: AppServices;
  logger: Logger;
};

export default function createGamesRouter({ services: { games } }: GamesRouterDependencies) {
  const gamesRouter = express.Router();
  const validator = createValidator();

  gamesRouter.post(
    '/',
    validator.body(CreateGamePayloadSchema),
    async (req: ValidatedRequest<CreateGameRequest>, res) => {
      const { userId, turnsAmount } = req.body;

      try {
        const user = await games.createGame({ userId, turnsAmount });

        res.status(200).send(user);
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    },
  );

  gamesRouter.post(
    '/:gameId/turn',
    validator.params(CreateTurnParamsSchema),
    validator.body(CreateTurnPayloadSchema),
    async (req: ValidatedRequest<CreateTurnRequest>, res) => {
      const { gameId } = req.params;
      const { userId, value } = req.body;

      try {
        const user = await games.submitGameTurn({ gameId, userId, value });

        res.status(200).send(user);
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    },
  );

  return gamesRouter;
}
