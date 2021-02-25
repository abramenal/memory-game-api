import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    { id: '1b059374-dc5a-4552-86b1-b807a0ac2734', username: 'test' },
    { id: 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc', username: 'test2' },
  ]);
}
