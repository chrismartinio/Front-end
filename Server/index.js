// Importing Node modules and initializing Express
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    config = require('./config/main'),
    socketEvents = require('./socketEvents'),
    cors = require('cors');

mongoose.connect(config.database, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



// Start the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');
const io = require('socket.io').listen(server);

socketEvents(io);

app.get('/api/auth/login', function(req, res) {
   res.send('this is a sample!');
});

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const router = require('./router');
router(app);