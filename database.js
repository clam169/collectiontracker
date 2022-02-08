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
    let result = await client
      .query(sqlQuery)
      .catch((err) => console.log('ERRROROROOROR', err));
    // return result.rows;
    return 'hellloooo';
  }

  async function updateEntryById(entryId, postData, callback) {
    const editDate = new Date();
    let sqlQuery = `UPDATE entry SET item_id = $1, source_id = $2, weight = $3, created = $4, last_edit = $5
    WHERE entry_id = $6`;
    let params = [
      postData.itemId,
      postData.sourceId,
      postData.weight,
      postData.date,
      editDate,
      entryId,
    ];
    await client.query(sqlQuery, params, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('---------SUCCESSFUL UPDATE---------------');
        callback(null, result);
      }
    });
  }

  // get list of cx connected sources
  async function getSources(accountId, callback) {
    let sqlQuery = `SELECT cx_source.source_id, name, address, phone_number FROM cx_source
    INNER JOIN source ON cx_source.source_id = source.source_id
    WHERE cx_account_id = $1;`;
    client.query(sqlQuery, [accountId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('--------------------------------');
        console.log('Sources', result.rows);
        callback(null, result.rows);
      }
    });
  }

  async function getItems(accountId, callback) {
    let sqlQuery = `SELECT account_item.item_id, name FROM public.account_item
      JOIN item ON account_item.item_id = item.item_id
      WHERE account_item.account_id = $1;`;
    // console.log(sqlQuery, '$1 is ', postData.body.account_id);
    client.query(sqlQuery, [accountId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('-----------GET ITEMS---------------------');
        console.log('items', result.rows);
        callback(null, result.rows);
      }
    });
  }

  async function getListOfEntries(accountId, callback) {
    let sqlQuery = `SELECT item.name AS item_name, source.name AS source_name, entry_id,
    TO_CHAR(created :: DATE, 'yyyy-mm-dd') AS entry_date, weight AS entry_weight
    FROM entry
    JOIN item ON entry.item_id = item.item_id
    JOIN source ON entry.source_id = source.source_id
    WHERE entry.account_id = $1;`;
    console.log('listofentries $1 is ', accountId);
    client.query(sqlQuery, [accountId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('--------------------------------');
        console.log(result.rows);
        callback(null, result.rows);
      }
    });
  }

  async function getEntryById(entryId, callback) {
    let sqlQuery = `SELECT item.name AS item_name, item.item_id,
    source.name AS source_name, source.source_id, entry_id,
    TO_CHAR(created :: DATE, 'yyyy-mm-dd') AS entry_date, weight AS entry_weight
    FROM entry
    JOIN item ON entry.item_id = item.item_id
    JOIN source ON entry.source_id = source.source_id
    WHERE entry.entry_id = $1;`;
    console.log('entrybyid $1 is ', entryId);
    client.query(sqlQuery, [entryId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('--------------------------------');
        console.log('single entry request', result.rows);
        callback(null, result.rows);
      }
    });
  }

  async function deleteEntry(entryId, callback) {
    let sqlQuery = `DELETE FROM entry WHERE entry_id = $1;`;
    console.log(sqlQuery, '$1 is ', entryId);
    client.query(sqlQuery, [entryId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('--------------------------------');
        console.log(result);
        callback(null, result);
      }
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
  };
};
