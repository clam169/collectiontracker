const path = require('path');
const express = require('express');
const inputValidation = require('./middleware/inputValidation');

module.exports = function (database) {
  const app = express();

  app.use(express.json());

  // serve the react app if request to /
  app.use(express.static(path.join(__dirname, 'build')));

  /** Test Route **/
  app.get('/api/test', async (req, res) => {
    if (!database) {
      res.send({ message: 'fuck me' });
    }
    const result = await database.testQuery();
    res.send({
      message: 'Teapot Test',
      result: result,
    });
  });

  /** Source Routes **/
  // getting all the sources associated with the logged in user
  app.get('/api/sources', async (req, res) => {
    //change 1 to account id after we can log in
    await database.getSources(1, (err, result) => {
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
  app.post('/api/sources', async (req, res) => {
    res.send(`New source to be added`);
  });

  /** Item Routes **/
  // get the list of items associated with this account
  app.get('/api/items', async (req, res) => {
    //change 1 to account id after we can log in
    await database.getItems(1, (err, result) => {
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
  app.post('/api/items', async (req, res, next) => {
    res.send(`New item to be added`);
  });

  /** Entry Routes **/
  // get the list of entries made by that account
  app.get('/api/entries', async (req, res) => {
    //change 1 to account id after we can log in
    await database.getListOfEntries(1, (err, result) => {
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
  app.get('/api/entry/:id', async (req, res) => {
    const entryId = req.params.id;
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
  app.put('/api/entry/:id', async (req, res) => {
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

  app.delete('/api/entry/:id', async (req, res) => {
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

  app.post('/api/entries', async (req, res) => {
    const accountId = 1;
    const { entries } = req.body;

    try {
      await database.addEntries(entries, accountId);
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
