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
  app.get('/api/sources', async (req, res) => {
    const result = await database.getSources(req, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json(result);

        //Output the results of the query to the Heroku Logs
        console.log('get sources --------------------------------');
      }
    });
    console.log(result);
  });

  /** Item Routes **/
  app.get('/api/items', async (req, res) => {
    const result = await database.getItems(req, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.json(result);

        //Output the results of the query to the Heroku Logs
        console.log('get sources --------------------------------');
      }
    });
    console.log(result);

    res.json(result);
  });

  /** Entry Routes **/
  app.get('/api/entries', async (req, res) => {
    const result = await database.getListOfEntries('account_id');
    console.log(result);

    res.json(result);
  });

  // post request to input data. Just validates for now
  app.post('/api/entries', inputValidation.validateInput, async (req, res) => {
    res.send(`data looks acceptable! ${JSON.stringify(req.body.data)}`);
  });

  app.get('/api/entry/:id', async (req, res) => {
    const entryId = req.params.id;
    const result = await database.getEntryById(entryId, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        console.log('this is from routes', result);
        const entry = result.rows[0];
        //success
        res.json({
          entryId: entry.entry_id,
          itemId: entry.item_id,
          sourceId: entry.source_id,
          date: entry.date,
          weight: entry.weight,
        });
        // res.send(result.rows);
      }
    });

    // console.log(result);

    // res.json(result);
  });

  app.put('/api/entry/:id', async (req, res) => {
    const entryId = req.params.id;
    const updatedEntry = req.body.data;
    const result = await database.updateEntryById(entryId, updatedEntry);
    console.log(result);

    res.json(result);
  });

  /** Render pages **/
  // anything that hasn't been serverd through a route should be served by the react app
  // /idk/someroute/longroute
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

  // post request to input data. Just validates for now
  app.post('/api/addItems', inputValidation.validateInput, async (req, res) => {
    res.send(`data looks acceptable! ${JSON.stringify(req.body.data)}`);
  });

  app.delete('/api/entry/delete', async (req, res) => {
    database.deleteEntry(req, (err, result) => {
      if (err) {
        res.send('Error reading from PostgreSQL');
        console.log('Error reading from PostgreSQL', err);
      } else {
        //success
        res.send(`entry ${req.body.entry_id} was deleted`);

        //Output the results of the query to the Heroku Logs
        console.log('deleteEntry --------------------------------');
      }
    });
  });

  ///////////////////////// Just realized that we might not use routes ----> We can refactor later, added header comments for now
  //   //Routes
  //   const entriesRouter = require('./routes/entries');

  //   app.use('/api/entries', entriesRouter);
  ////////////////////////////////
  return app;
};
