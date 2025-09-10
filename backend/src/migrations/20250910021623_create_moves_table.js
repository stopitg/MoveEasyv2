/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('moves', function(table) {
    table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.json('start_location').notNullable();
    table.json('end_location').notNullable();
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
