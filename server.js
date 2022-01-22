const makeApp = require('./app.js');
require('dotenv').config();

// Database setup
const makeDatabase = require("./database")
makeDatabase()
.then(database => {
    const app = makeApp(database)

    // Start the server
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Application is running on port ${port}`);
    });
})



// process.on('unhandledRejection', (err) => {
//     console.log('UNHANDLED REJECTION!!!  shutting down ...');
//     console.log(err);
//     server.close(() => {
//         process.exit(1);
//     });
// });
