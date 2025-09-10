/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('moves', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.jsonb('start_location').notNullable();
    table.jsonb('end_location').notNullable();
    table.date('move_date').notNullable();
    table.string('status').notNullable().defaultTo('planning');
    table.integer('household_size');
    table.string('inventory_size_estimate');
    table.timestamps(true, true);
    
    table.index('user_id');
    table.index('move_date');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('moves');
};
