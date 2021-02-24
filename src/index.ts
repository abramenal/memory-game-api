import { APP_PORT, NODE_ENV } from './bootstrap';

import './db/connection';

import createLogger from './logger';
import createApp from './app';
import createServices from './services';

const isDevelopment = NODE_ENV !== 'production';
const logLevel = isDevelopment ? 'info' : 'error';

const logger = createLogger({ level: logLevel, isDevelopment });

const services = createServices({ logger });

createApp({ port: APP_PORT }, { logger, services });
