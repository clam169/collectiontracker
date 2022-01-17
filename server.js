//Define the include function for absolute file name
global.base_dir = __dirname;
global.abs_path = function (path) {
    return base_dir + path;
};
global.include = function (file) {
    return require(abs_path('/' + file));
};

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err);
    process.exit(1);
});

const app = require('./app');

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
