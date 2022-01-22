const path = require('path');
const express = require('express');

module.exports = function(database) {
    const app = express();

    // serve the react app if request to /
    app.use(express.static(path.join(__dirname, 'build')));
    
    // setup the route
    // start these with api
    app.get('/api/test', async (req, res) => {

        const result = await database.testQuery("Whoe cares")
        console.log(result)

        res.send({
            message: 'Happy Route :)',
        });
    });
    
    // anything that hasn't been serverd through a route should be served by the react app
    // /idk/someroute/longroute
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/build/index.html'));
    });
    
    return app
}

