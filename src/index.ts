import { APP_PORT, NODE_ENV } from './bootstrap';

import './db/connection';
import checkConnection from './db/checkConnection';

import createLogger from './logger';
import createApp from './app';
import createServices from './services';

const isDevelopment = NODE_ENV !== 'production';
const logLevel = isDevelopment ? 'info' : 'error';

const logger = createLogger({ level: logLevel, isDevelopment });

const services = createServices({ logger });

const app = createApp({ logger, services }, { useHTTPLogger: true });

app.listen(APP_PORT, () => {
  logger.info(`Application is started on "${APP_PORT}" port`);
  checkConnection(logger)
    .then(() => {
      logger.info('Database connection is set');
    })
    .catch(err => {
      logger.info('Database connection failed', err);
      process.exit(1);
    });
});
