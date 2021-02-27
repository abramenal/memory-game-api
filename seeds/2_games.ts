import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('games').del();

  await knex('games').insert([
    {
      id: 'a6321738-f691-4adc-968e-a60b42276fd7',
      status: 'completed',
      sequence: [1, 2, 3, 4],
      current_turn: 4,
      turns_total: 4,
      user_id: '1b059374-dc5a-4552-86b1-b807a0ac2734',
    },
    {
      id: 'a2e919c1-882c-4ba7-b9c5-3f4ec58f1fa3',
      status: 'started',
      sequence: [5, 20, 1, 4],
      current_turn: 3,
      turns_total: 4,
      user_id: 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc',
    },
    {
      id: '150d3a34-4346-49d0-a71c-7063a178bc50',
      status: 'started',
      sequence: [10, 20, 30, 40],
      current_turn: 3,
      turns_total: 4,
      user_id: 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc',
    },
    {
      id: '037d4554-51d4-4004-b6dd-5c772644c9cf',
      status: 'started',
      sequence: [6, 7, 8, 9],
      current_turn: 0,
      turns_total: 4,
      user_id: 'ee0e8b34-b2d3-4fba-bb48-d56d14a9aabc',
    },
  ]);
}
