import knex from 'knex';

type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export default function createConnection({ host, port, user, password, database }: DatabaseConfig) {
  const connection = knex({
    client: 'postgresql',
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
  });

  return connection;
}
