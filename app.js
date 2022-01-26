const path = require('path');
const express = require('express');

module.exports = function (database) {
  const app = express();

  // serve the react app if request to /
  app.use(express.static(path.join(__dirname, 'build')));

  // setup the route
  // start these with api
  app.get('/api/test', async (req, res) => {
    res.send({
      message: 'Happy Route :)',
    });
  });

  app.get('/api/sources', async (req, res) => {
    const result = await database.getSources('account_id');
    console.log(result);

    res.json(result);
  });

  app.get('/api/getEntries', async (req, res) => {
    const result = await database.getListOfEntries('account_id');
    console.log(result);

    res.json(result);
  });

  // anything that hasn't been serverd through a route should be served by the react app
  // /idk/someroute/longroute
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

  //Routes
  const entriesRouter = include('routes/entry');

  app.use('/api/entries', entriesRouter);

  return app;
};
