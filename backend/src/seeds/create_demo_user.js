const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash the demo password
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  // Insert demo user
  await knex('users').insert([
    {
      id: 'demo-user-123',
      email: 'demo@gmail.com',
      password: hashedPassword,
      first_name: 'Demo',
      last_name: 'User',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
