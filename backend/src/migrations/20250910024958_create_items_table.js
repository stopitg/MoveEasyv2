/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('items', function(table) {
    table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string('move_id').notNullable().references('id').inTable('moves').onDelete('CASCADE');
    table.string('room_id').references('id').inTable('rooms').onDelete('SET NULL');
    table.string('box_id').references('id').inTable('boxes').onDelete('SET NULL');
    table.string('name', 255).notNullable();
    table.text('description');
    table.string('photo_url', 500);
    table.decimal('estimated_value', 10, 2);
    table.json('properties'); // For flexible item properties
    table.string('condition', 50); // new, good, fair, poor
    table.string('category', 100); // furniture, electronics, clothing, etc.
    table.boolean('is_fragile').defaultTo(false);
    table.boolean('requires_special_handling').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for performance
    table.index('move_id');
    table.index('room_id');
    table.index('box_id');
    table.index(['move_id', 'room_id']);
    table.index(['move_id', 'category']);
    table.index('name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
