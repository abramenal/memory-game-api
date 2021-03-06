import express from 'express';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import cors from 'cors';

import { users, games } from './routes';

import { Logger } from './logger';
import { AppServices } from './services';

type AppConfiguration = {
  useHTTPLogger: boolean;
};

type AppDependencies = {
  logger: Logger;
  services: AppServices;
};

export default function createApp({ logger, services }: AppDependencies, { useHTTPLogger }: AppConfiguration) {
  const app = express();

  if (useHTTPLogger) {
    app.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json()),
        meta: true,
        colorize: true,
      }),
    );
  }

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/users', users({ services, logger }));
  app.use('/games', games({ services, logger }));

  return app;
}
