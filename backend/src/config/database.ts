import knex from 'knex';
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

if (!dbConfig) {
  throw new Error(`No database configuration found for environment: ${environment}`);
}

export const db = knex(dbConfig);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    console.log(`✅ Database connected successfully (${environment})`);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
  });

export default db;