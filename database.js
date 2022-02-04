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

  async function getSources(postData, callback) {
    let sqlQuery = `SELECT cx_source.source_id, name FROM public.cx_source
    JOIN source ON cx_source.source_id = source.source_id
    WHERE cx_account_id = $1;`;
    console.log(sqlQuery, '$1 is ', postData.body.account_id);
    client.query(sqlQuery, [postData.body.account_id], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      console.log(result);
      callback(null, result.rows);
    });
  }

  async function deleteEntry(postData, callback) {
    let sqlQuery = `DELETE FROM entry WHERE entry_id = $1;`;
    console.log(sqlQuery, '$1 is ', postData.body.entry_id);
    client.query(sqlQuery, [postData.body.entry_id], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      console.log(result);
      callback(null, result);
    });
  }

  return {
    testQuery,
    getSources,
    deleteEntry,
  };
};
