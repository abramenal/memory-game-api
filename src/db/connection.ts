import knex from 'knex';
import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export default knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: parseInt(DB_PORT!, 10),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
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
