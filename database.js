const { Pool } = require('pg');


const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PWD,
    database: process.env.PG_DATABASE,
});

module.exports = async function() {
  const client = await pool.connect()

  async function testQuery(username) {
    console.log("called testQuery")
    // need to update this if we change database for user account id
  
    let sqlQuery = 'SELECT * FROM accounts WHERE username = $1';
    let values = [username];
    let user = await client.query(sqlQuery, values)
    return user;
  }
  
  return {
    testQuery
  }
}

