/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('move_id').notNullable().references('id').inTable('moves').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.date('due_date');
    table.string('status').notNullable().defaultTo('pending');
    table.string('category').notNullable();
    table.integer('priority').defaultTo(0);
    table.integer('order_index').defaultTo(0);
    table.timestamps(true, true);
    
    table.index('move_id');
    table.index('status');
    table.index('category');
    table.index('due_date');
    table.index('order_index');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};