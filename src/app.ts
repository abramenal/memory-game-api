import express from 'express';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';

import { users, games } from './routes';

import { Logger } from './logger';
import { AppServices } from './services';

type AppConfig = {
  port: number;
};

type AppDependencies = {
  logger: Logger;
  services: AppServices;
};

export default function createApp({ port }: AppConfig, { logger, services }: AppDependencies) {
  const app = express();

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.json()),
      meta: true,
      colorize: true,
    }),
  );
  app.use(bodyParser.json());

  app.use('/users', users({ services, logger }));
  app.use('/games', games({ services, logger }));

  return app.listen(port, () => {
    logger.info(`Application is started on "${port}" port`);
  });
}
