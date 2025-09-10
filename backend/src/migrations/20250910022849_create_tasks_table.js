/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('move_id').notNullable().references('id').inTable('moves').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.date('due_date');
    table.string('status', 20).notNullable().defaultTo('pending');
    table.string('category', 50).notNullable();
    table.integer('priority').defaultTo(0);
    table.integer('order_index').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for performance
    table.index('move_id');
    table.index('status');
    table.index('category');
    table.index('due_date');
    table.index(['move_id', 'status']);
    table.index(['move_id', 'category']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};