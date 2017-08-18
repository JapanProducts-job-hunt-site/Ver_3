/*
 * Import all packages
 */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./server/routes/index');

const app = express();

// To use .env file
require('dotenv').config();

// =================================================================
// configuration ===================================================
// =================================================================
const port = process.env.PORT || 8080;

// To avoid error of mongoose mpromise DeprecationWarning
mongoose.Promise = global.Promise;

// don't show the log when it is test
// Connect to test db when it is test
if (process.env.NODE_ENV !== 'test') {
  // use morgan to log at command line
  app.use(morgan('dev'));
  // Connect to read database
  mongoose.connect(process.env.database);
} else if (process.env.NODE_ENV === 'test') {
  // Connect to test database
  mongoose.connect(process.env.test_db);
}

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 * Configuration for static files
 * index.html looks for these files
 */
app.use(express.static(`${__dirname}/client/app`));
app.use('/dist', express.static(`${__dirname}/client/dist`));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use('/static', express.static(`${__dirname}/client/static/`));

/*
 * All routing happens in server/routes
 */
app.use('/', routes);

/*
 * Start server
 */
app.listen(port);
