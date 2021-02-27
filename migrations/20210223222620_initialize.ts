import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"');

  await knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').unique();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('games', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.enu('status', ['started', 'completed', 'failed']).defaultTo('started').notNullable();
    table.specificType('sequence', 'INT[]').notNullable();
    table.integer('current_step').unsigned().defaultTo('0').notNullable();
    table.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('game_turns', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('value').notNullable();
    table.uuid('game_id').references('games.id').notNullable().onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('game_turns');
  await knex.schema.dropTableIfExists('games');
  await knex.schema.dropTableIfExists('users');
}
