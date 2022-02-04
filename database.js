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

  return {
    testQuery,
  };
};

async function deleteEntry(postData, callback) {
  const client = await pool.connect();
  let sqlQuery = `DELETE FROM entry WHERE entry_id = $1;`;
  console.log(sqlQuery);
  client.query(sqlQuery, [postData.params.entry_id], (err, result) => {
    if (err) {
      callback(err, null);
    }
    console.log('--------------------------------');
    console.log(result);
    callback(null, result);
  });
}
