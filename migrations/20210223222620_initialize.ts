import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('username');
    table.timestamps();
  });

  await knex.schema.createTable('games', table => {
    table.uuid('id').primary();
    table.enu('status', ['started', 'completed', 'failed']).defaultTo('started').notNullable();
    table.string('sequence').notNullable();
    table.integer('current_step').unsigned().defaultTo('0').notNullable();
    table.uuid('user_id').references('users.id').notNullable();
    table.timestamps();
  });

  await knex.schema.createTable('game_turns', table => {
    table.uuid('id').primary();
    table.string('value').notNullable();
    table.uuid('user_id').references('users.id').notNullable();
    table.uuid('game_id').references('games.id').notNullable();
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('games');
  await knex.schema.dropTableIfExists('game_turns');
}
