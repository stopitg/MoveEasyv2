/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('boxes', function(table) {
    table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string('move_id').notNullable().references('id').inTable('moves').onDelete('CASCADE');
    table.string('label', 100).notNullable();
    table.string('qr_code', 255).unique();
    table.string('destination_room_id').references('id').inTable('rooms').onDelete('SET NULL');
    table.string('box_type', 50).defaultTo('standard'); // standard, fragile, heavy, etc.
    table.text('notes');
    table.boolean('is_packed').defaultTo(false);
    table.boolean('is_loaded').defaultTo(false);
    table.boolean('is_delivered').defaultTo(false);
    table.timestamp('packed_at');
    table.timestamp('loaded_at');
    table.timestamp('delivered_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for performance
    table.index('move_id');
    table.index('destination_room_id');
    table.index('qr_code');
    table.index(['move_id', 'is_packed']);
    table.index(['move_id', 'is_delivered']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('boxes');
};
