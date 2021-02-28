import path from 'path';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
} else {
  dotenv.config();
}

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, NODE_ENV } = process.env;
const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT!, 10);
const PORT = parseInt(process.env.PORT!, 10);

const missing = [POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, NODE_ENV, POSTGRES_PORT, PORT].filter(
  v => !v,
);

if (missing.length > 0) {
  throw new Error('Application ENV variables are not set properly');
}

export { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, PORT, NODE_ENV };
