const { Pool } = require('pg');

const { sqlValues, sourceValues } = require('./databaseHelpers');

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  password: process.env.PG_PWD,
  database: process.env.PG_DATABASE,
});

module.exports = async function () {
  const client = await pool.connect();

  const auth = 'auth0|62070daf94fb2700687ca3b3';

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

  async function findAccount(authId) {
    console.log('looking for auth0 user!!!!!');
    let result = await client.query(
      'SELECT * FROM account where auth0_id = $1',
      [authId]
    );
    if (result.rows[0]) {
      // user has been found, return user info from postgres
      // console.log('the user: ', result.rows[0]);
      return result.rows[0];
    } else {
      console.log('cannot find user');
      return false;
    }
  }

  async function addAccount(claims) {
    const { nickname, email, sub } = claims;

    // add info from auth0 to posgresql
    await client.query(
      'INSERT INTO account (nickname, email, auth0_id, account_type_id) VALUES ($1, $2, $3, $4)',
      [nickname, email, sub, 1]
    );

    // check that the auth0 info was added properly
    let result = await client.query(
      'SELECT * FROM account where auth0_id = $1',
      [sub]
    );
    return result.rows[0];
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
    console.log('PARAAMSMAMASMMASMASMASMAS');
    console.log(params);

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
  async function getSources(authId) {
    console.log('AAAAAUTH ', authId);
    const sqlQuery = `SELECT cx_source.source_id, name, address, phone_number FROM cx_source
    JOIN source ON cx_source.source_id = source.source_id
    JOIN account ON cx_source.cx_account_id = account.account_id
    WHERE account.auth0_id = $1;`;
    const result = await client.query(sqlQuery, [authId]);

    return result.rows;
  }

  // add new source for logged in user
  async function addSource(newSource, accountId) {
    const sqlQuery = `with new_source as (
      insert into source(name, address)
      values ($2, $3)
      returning source_id)
      insert into cx_source (source_id, cx_account_id)
      select source_id, $1
      from new_source;`;
    const result = await client.query(sqlQuery, [accountId, newSource.name, newSource.address]);

    return result.rows;
  }

  async function getItems(authId) {
    let sqlQuery = `SELECT account_item.item_id, name FROM public.account_item
      JOIN item ON account_item.item_id = item.item_id
      JOIN account ON account_item.account_id = account.account_id
      WHERE account.auth0_id = $1;`;
    //   WHERE account_item.account_id = $1;`;
    // client.query(sqlQuery, [accountId], (err, result) => {
    const result = await client.query(sqlQuery, [authId]);

    return result.rows;
  }

  async function getListOfEntries(authId, callback) {
    let sqlQuery = `SELECT item.name AS item_name, item.item_id,
    source.name AS source_name, source.source_id, entry_id,
    TO_CHAR(created :: DATE, 'yyyy-mm-dd') AS entry_date, weight AS entry_weight
    FROM entry
    JOIN item ON entry.item_id = item.item_id
    JOIN source ON entry.source_id = source.source_id
    JOIN account ON entry.account_id = account.account_id
    WHERE account.auth0_id = $1
    ORDER by CREATED desc, entry_id desc;`;
    const result = await client.query(sqlQuery, [authId]);

    return result.rows;
  }

  async function getEntryById(entryId, callback) {
    let sqlQuery = `SELECT item.name AS item_name, item.item_id,
    source.name AS source_name, source.source_id, entry_id,
    TO_CHAR(created :: DATE, 'yyyy-mm-dd') AS entry_date, weight AS entry_weight
    FROM entry
    JOIN item ON entry.item_id = item.item_id
    JOIN source ON entry.source_id = source.source_id
    JOIN account ON entry.account_id = account.account_id
    WHERE entry.entry_id = $1;`;
    console.log('entrybyid $1 is ', entryId);

    const result = await client.query(sqlQuery, [entryId]);

    return result.rows;
  }

  async function deleteEntry(entryId, callback) {
    let sqlQuery = `DELETE FROM entry WHERE entry_id = $1;`;
    console.log(sqlQuery, '$1 is ', entryId);
    const result = await client.query(sqlQuery, [entryId]);

    return result;
  }

  const addEntries = async (entries, accountId) => {
    // change to receiving auth0
    function arrayFromEntry(entry) {
      // (account_id, source_id, item_id, weight, created, last_edit)
      return [
        accountId,
        entry.source_id,
        entry.item_id,
        entry.weight,
        entry.created,
        entry.created,
      ];
    }
    const inputValues = entries.map(arrayFromEntry);

    const valuesData = sqlValues(inputValues);
    console.log('VALUES DATA: ', valuesData);

    const sqlQuery = `INSERT into entry
    (account_id, source_id, item_id, weight, created, last_edit)
    ${valuesData.sql}`;

    let result = await client.query(sqlQuery, valuesData.values);
    return result;
  };

  return {
    testQuery,
    getEntryById,
    getSources,
    addSource,
    getItems,
    getListOfEntries,
    deleteEntry,
    updateEntryById,
    addEntries,
    findAccount,
    addAccount,
  };
};
