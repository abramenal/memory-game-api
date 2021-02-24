import knex from 'knex';
import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

const isDevelopment = NODE_ENV !== 'production';

const connection = knex({
  client: 'pg',
  debug: isDevelopment,
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

    afterCreate: (conn: any, done: any) => {
      conn.query('select 1+1 as result', (err: any) => {
        if (err) {
          done(err, conn);
        }

        done(null, conn);
      });
    },
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

export default connection;
