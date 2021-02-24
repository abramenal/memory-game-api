import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;
const DB_PORT = parseInt(process.env.DB_PORT!, 10);
const APP_PORT = parseInt(process.env.APP_PORT!, 10);

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME || !NODE_ENV || !DB_PORT || !APP_PORT) {
  throw new Error('Application ENV variables are not set properly');
}

export { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, APP_PORT, NODE_ENV };
