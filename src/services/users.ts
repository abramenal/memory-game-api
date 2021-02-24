import knex from '../db/connection';
import { User } from '../types';

type CreateUserPayload = {
  username: string;
};

export const createUser = async ({ username }: CreateUserPayload): Promise<User> => {
  const res = await knex<User>('users')
    .insert({
      username,
    })
    .returning('*');

  return res[0];
};

type GetUserPayload = {
  username: string;
};

export const getUser = async ({ username }: GetUserPayload): Promise<User> => {
  const res = await knex<User>('users').where({ username }).first();

  if (!res) {
    throw new Error(`Cannot find user "${username}"`);
  }

  return res;
};
