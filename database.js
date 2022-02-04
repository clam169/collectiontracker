const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  password: process.env.PG_PWD,
  database: process.env.PG_DATABASE,
});

module.exports = async function () {
  const client = await pool.connect();

  async function testQuery() {
    console.log('called testQuery');
    // need to update this if we change database for user account id

    let sqlQuery = 'SELECT * FROM things';
    let result = await client.query(sqlQuery);
    return result.rows;
  }

  async function getEntryById(entryId) {
    console.log('called getEntryByID');
    let sqlQuery = 'SELECT * FROM entry WHERE entry_id =$1';
    let result = await client.query(sqlQuery, entryId);
    return result.rows;
    // return {
    //   item_name: 'Coffee Grinds',
    //   item_id: 2,
    //   source_name: 'Cafe 2',
    //   source_id: 2,
    //   entry_id: 6,
    //   entry_date: '2022-01-24',
    //   entry_weight: 20,
    // };
  }

  return {
    testQuery,
    getEntryById
  };
};
