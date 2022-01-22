/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('things').del()
    .then(function () {
      // Inserts seed entries
      return knex.raw(`
      INSERT INTO things (username)
      values ('sam'),
      ('test tickles'),
      ('jo jo'),
      ('Megan'),
      ('sara');
      `)
    });
};         
