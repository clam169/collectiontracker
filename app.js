const path = require('path');
const express = require('express');
const app = express();

// serve the react app if request to /
app.use(express.static(path.join(__dirname, 'build')));

// setup the route
// start these with api
app.get('/api/test', (req, res) => {
    res.send({
        message: 'Happy Route :)',
    });
});

// anything that hasn't been serverd through a route should be served by the react app
// /idk/someroute/longroute
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

module.exports = app;
