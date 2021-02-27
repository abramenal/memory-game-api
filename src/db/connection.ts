import knex from 'knex';
import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, NODE_ENV } from '../bootstrap';

const isDevelopment = NODE_ENV === 'development';

export default knex({
  client: 'pg',
  debug: isDevelopment,
  connection: {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
  postProcessResponse: result => {
    if (Array.isArray(result)) {
      return result.map(row => camelcaseKeys(row, { deep: true }));
    }

    return camelcaseKeys(result, { deep: true });
  },
  wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),
});
