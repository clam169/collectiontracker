const path = require('path');
const express = require('express');
const inputValidation = require('./middleware/inputValidation');
const { requiresAuth } = require('express-openid-connect');
const checkAuth = require('./middleware/authentication');
const { auth } = require('express-openid-connect');
const jwt_decode = require('jwt-decode');

const authConfig = require('./auth');

module.exports = function (database) {
  const app = express();

  app.use(express.json());

  const authId = 'auth0|62070daf94fb2700687ca3b3';
  // TODO: add to each api-> authId =req.oidc?.user?.sub;

  // after login
  authConfig.afterCallback = (req, res, session) => {
    const claims = jwt_decode(session.id_token);

    const {
      given_name,
      family_name,
      nickname,
      name,
      picture,
      locale,
      updated_at,
      email,
      email_verified,
      iss,
      sub,
      aud,
      iat,
      exp,
      nonce,
    } = claims;

    console.log(sub);
    console.log('claimssssss', claims);

    // select * from users where auth0_id = sub
    // if no user is returned then
    // insert into users (auth0_id) values (sub)
    // now you have a user in the database
    try {
      database.findAccount(sub);
      return session;
    } catch (error) {
      console.error(error);
      res.status(500).send({ error });
    }
  };

  app.use(auth(authConfig));

  // serve the react app if request to /
  app.use(express.static(path.join(__dirname, 'build')));

  /** Test Route **/
  const authId = 'auth';
  app.get('/api/test', checkAuth, async (req, res) => {
    // const userStatus = req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out';
    const result = await database.testQuery();
    res.send({
      // userStatus: userStatus,
      message: 'Teapot Test',
      result: result,
    });
  });

  /** Auth Route **/

  app.get('/api/profile', checkAuth, (req, res) => {
    const authId = req.oidc?.user?.sub;
    if (authId) { // user is logged in with auth0
      let isFound = findAccount(authId)
    }
    // select * from account where auth0_id = authId
    // returns the user object
    res.send({ user: { ...req.oidc?.user } });
  });

  /** Source Routes **/
  // getting all the sources associated with the logged in user
  app.get('/api/sources', checkAuth, async (req, res) => {
    //change 1 to account id after we can log in
    // const authId = req.oidc?.user?.sub;

    await database.getSources(authId, (err, result) => {
      if (err) {
        res.json({ message: 'Error reading from PostgreSQL' });
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json(result);
        console.log('get source list~~~~~~~~~~~~~~');
      }
    });
  });

  // TODO: post request to add a new source to this Cx account
  app.post('/api/sources', checkAuth, async (req, res) => {
    res.send(`New source to be added`);
  });

  /** Item Routes **/
  // get the list of items associated with this account
  app.get('/api/items', checkAuth, async (req, res) => {
    //change 1 to account id after we can log in
    await database.getItems(authId, (err, result) => {
      if (err) {
        res.json({ message: 'Error reading from PostgreSQL' });
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json(result);
        //Output the results of the query to the Heroku Logs
        console.log('get items --------------------------------');
      }
    });
  });

  // TODO: post request to input data. Just validates for now
  app.post('/api/items', checkAuth, async (req, res, next) => {
    res.send(`New item to be added`);
  });

  /** Entry Routes **/
  // get the list of entries made by that account
  app.get('/api/entries', checkAuth, async (req, res) => {
    //change 1 to account id after we can log in
    await database.getListOfEntries(authId, (err, result) => {
      if (err) {
        res.json({ message: 'Error reading from PostgreSQL' });
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json(result);
        //Output the results of the query to the Heroku Logs
        console.log('get List of Entries --------------------------------');
      }
    });
  });

  // get a single entry for displaying that entry's info
  app.get('/api/entry/:id', checkAuth, async (req, res) => {
    const entryId = req.params.id;
    // check user id
    await database.getEntryById(entryId, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        const entry = result[0];
        //success
        res.send(entry);
        // option to change the styling of the data to a more common JSON format
        // res.json({
        //   entryId: entry.entry_id,
        //   itemId: entry.item_id,
        //   sourceId: entry.source_id,
        //   date: entry.created,
        //   weight: entry.weight,
        // });
      }
    });
  });

  //updates an entry with new data
  app.put('/api/entry/:id', checkAuth, async (req, res) => {
    const entryId = req.params.id;
    const updatedEntry = req.body.data;
    console.log('updatedEntry', updatedEntry);
    await database.updateEntryById(entryId, updatedEntry, (err, result) => {
      if (err) {
        console.log('Something went wrong :(', err);
        res.json({ message: 'Error updating' });
      } else {
        console.log(`updating worked!`);
        // send back confirmation
        res.json({ message: 'Update successful' });
      }
    });
  });

  app.delete('/api/entry/:id', checkAuth, async (req, res) => {
    const entryId = req.params.id;
    database.deleteEntry(entryId, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json({ message: `entry ${entryId} was deleted` });
        //Output the results of the query to the Heroku Logs
        console.log('deleteEntry --------------------------------');
      }
    });
  });

  app.post('/api/entries', checkAuth, async (req, res) => {
    // const accountId = 2; // need to query with authId
    const { entries } = req.body;

    try {
      await database.addEntries(entries, authId);
      // await database.addEntries(entries, accountId);
      res.send({});
    } catch (error) {
      console.error(error);
      res.status(500).send({ error });
    }
  });

  /** Render pages **/
  // anything that hasn't been serverd through a route should be served by the react app
  // /idk/someroute/longroute
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

  ///////////////////////// Just realized that we might not use routes ----> We can refactor later, added header comments for now
  //   //Routes
  //   const entriesRouter = require('./routes/entries');

  //   app.use('/api/entries', entriesRouter);
  ////////////////////////////////
  return app;
};
