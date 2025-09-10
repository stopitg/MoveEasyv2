import knex from 'knex';
const config = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

export const db = knex(dbConfig);

export default db;
