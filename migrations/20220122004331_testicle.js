/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE things
  (
      account_id SERIAL,
      username VARCHAR(255) NOT NULL,
      CONSTRAINT admin_accounts_pkey PRIMARY KEY (account_id)
      
  )
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
  DROP TABLE things
  `)
};
