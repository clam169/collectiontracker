// Update with your config settings.
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      port: process.env.PG_PORT,
      password: process.env.PG_PWD,
      database: process.env.PG_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      port: process.env.PG_PORT,
      password: process.env.PG_PWD,
      database: process.env.PG_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.PROD_HOST,
      user: process.env.PROD_USER,
      port: process.env.PROD_PORT,
      password: process.env.PROD_PWD,
      database: process.env.PROD_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
