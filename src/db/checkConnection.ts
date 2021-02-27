import retry from 'async-retry';
import connection from './connection';

import { Logger } from '../logger';

export default async function checkConnection(logger: Logger) {
  await retry(
    async () => {
      await connection.raw('SELECT 1+1 as result');
    },
    {
      retries: 3,
      onRetry: () => {
        logger.warn('Cannot establish DB connection, retrying...');
      },
    },
  );
}
