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

  if (!client) {
    console.log('WHY IS THERE NO CLIENT');
  } else {
    console.log('there is a client');
  }

  async function testQuery() {
    console.log('called testQuery');
    // need to update this if we change database for user account id

    let sqlQuery = 'SELECT * FROM things';
    let result = await client
      .query(sqlQuery)
      .catch((err) => console.log('ERRROROROOROR', err));
    // return result.rows;
    return 'hellloooo';
  }

  async function getEntryById(entryId, callback) {
    let sqlQuery = 'SELECT * FROM entry WHERE entry_id =$1';
    console.log(`called getEntryByID for ${entryId}: `, sqlQuery);
    let result = await client.query(sqlQuery, [entryId], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      // console.log(result);
      callback(null, result);
    });
  }
  // return result;
  // return {
  //   item_name: 'Coffee Grinds',
  //   item_id: 2,
  //   source_name: 'Cafe 2',
  //   source_id: 2,
  //   entry_id: 6,
  //   entry_date: '2022-01-24',
  //   entry_weight: 20,
  // };

  async function updateEntryById(entryId, postData, callback) {
    let sqlQuery = `UPDATE entry SET item_id = $1, source_id = $2, weight = $3, created = $4
     WHERE entry_id = $5`;
    let params = [
      postData.itemId,
      postData.sourceId,
      postData.weight,
      postData.date,
      entryId,
    ];
    await client.query(sqlQuery, params, (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      // console.log(result);
      callback(null, result);
    });
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

  // get list of cx connected sources
  async function getCxSources(accountId, callback) {
    let sqlQuery = `SELECT name, address, phone_number FROM cx_source
    INNER JOIN source ON cx_source.source_id = source.source_id
    WHERE cx_account_id = $1;`;
    client.query(sqlQuery, [accountId], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      console.log(result);
      callback(null, result.rows);
    });
  }

  async function getItems(postData, callback) {
    let sqlQuery = `SELECT account_item.item_id, name FROM public.account_item
      JOIN item ON account_item.item_id = item.item_id
      WHERE account_id = $1;`;
    console.log(sqlQuery, '$1 is ', postData.body.account_id);
    client.query(sqlQuery, [postData.body.account_id], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      console.log(result.rows);
      callback(null, result.rows);
    });
  }

  async function getListOfEntries(postData, callback) {
    let sqlQuery = `SELECT item.name AS item_name, source.name AS source_name, entry_id, 
    created AS entry_date, weight AS entry_weight
    FROM entry 
    JOIN item ON entry.item_id = item.item_id 
    JOIN source ON entry.source_id = source.source_id
    WHERE entry_id = $1;`;
    console.log(sqlQuery, '$1 is ', postData.body.account_id);
    client.query(sqlQuery, [postData.body.account_id], (err, result) => {
      if (err) {
        callback(err, null);
      }
      console.log('--------------------------------');
      console.log(result.rows);
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
    getEntryById,
    getSources,
    getItems,
    getListOfEntries,
    deleteEntry,
    updateEntryById,
    getCxSources,
  };
};
