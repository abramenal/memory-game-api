import dotenv from 'dotenv';

type AppConfig = {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

export default function configure(): AppConfig {
  dotenv.config();

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const DB_PORT = parseInt(process.env.DB_PORT!, 10);

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Application ENV variables are not set properly');
  }

  return { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME };
}
