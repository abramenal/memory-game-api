import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('game_turns').del();

  await knex('game_turns').insert([
    { id: '923d2464-a337-437f-823d-64a046a37a27', value: 1, game_id: 'a6321738-f691-4adc-968e-a60b42276fd7' },
    { id: '57c9c43f-7a2c-46ee-9a28-9e499df0cc7c', value: 2, game_id: 'a6321738-f691-4adc-968e-a60b42276fd7' },
    { id: '2bd44542-e4a7-43f5-8066-e5ea83b93b26', value: 3, game_id: 'a6321738-f691-4adc-968e-a60b42276fd7' },
    { id: '92b60805-976f-4177-8bec-5f38ee3a73ac', value: 4, game_id: 'a6321738-f691-4adc-968e-a60b42276fd7' },
    { id: 'ed980817-3463-4fd8-aac2-3c530a062edc', value: 5, game_id: 'a2e919c1-882c-4ba7-b9c5-3f4ec58f1fa3' },
    { id: '1de6e1c9-624e-4e61-85bb-17bd49ec5c8e', value: 20, game_id: 'a2e919c1-882c-4ba7-b9c5-3f4ec58f1fa3' },
    { id: 'f6d912b3-bf15-487d-b3f8-c766aba4bf96', value: 1, game_id: 'a2e919c1-882c-4ba7-b9c5-3f4ec58f1fa3' },
    { id: '9ec3a0ae-185b-4d50-8545-80a699f95040', value: 10, game_id: '150d3a34-4346-49d0-a71c-7063a178bc50' },
    { id: '6aefd8a3-7513-4e30-ab71-3a4d5b8215d0', value: 20, game_id: '150d3a34-4346-49d0-a71c-7063a178bc50' },
    { id: 'b59cd3a8-4fdc-4fe0-abc9-401275a24c4b', value: 30, game_id: '150d3a34-4346-49d0-a71c-7063a178bc50' },
  ]);
}
