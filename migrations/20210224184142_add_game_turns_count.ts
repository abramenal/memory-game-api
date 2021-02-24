import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('games', table => {
    table.renameColumn('current_step', 'current_turn');
    table.integer('turns_total').unsigned().defaultTo('0').notNullable();
  });
  // skip data migration since don't have data yet, integrity cannot be affected
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('games', table => {
    table.renameColumn('current_turn', 'current_step');
    table.dropColumn('turns_total');
  });
}
