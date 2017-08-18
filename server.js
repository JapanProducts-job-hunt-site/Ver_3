// =================================================================
// get the packages we need ========================================
// =================================================================
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('./api/models/user'); // get our mongoose model
const Company = require('./api/models/company'); // get our mongoose model

const app = express();

// To use .env file
require('dotenv').config();

// =================================================================
// configuration ===================================================
// =================================================================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

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

app.set('superSecret', process.env.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Tell the server to look at these directories to look for static files
app.use(express.static(`${__dirname}/client/app`));
app.use('/dist', express.static(`${__dirname}/client/dist`));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use('/static', express.static(`${__dirname}/client/static/`));


// =================================================================
// routes ==========================================================
// =================================================================

// basic route (http://localhost:8080)
app.get('/', (req, res) => {
  res.send(`Hello! The API is at http://localhost:${port}/api`);
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
const apiRoutes = express.Router();

apiRoutes.post('/register', (req, res) => {
  if (!req.body.firstName) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter first name.' });
  } else if (!req.body.lastName) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter last name.' });
  } else if (!req.body.password) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter password.' });
  } else if (!req.body.email) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter email.' });
  }
  // create a sample user
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    admin: false,
  });
  newUser.save((err) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: err,
      });
    }
    return res.json({ success: true });
  });
});


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', (req, res) => {
  if (!req.body.email) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter email.' });
  } else if (!req.body.password) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter password.' });
  }

  // find the user
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    }

    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. Email not found.' });
    } else if (user) {
      // check if password matches
      if (user.password !== req.body.password) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a toke
        // In the JWT's payload(where all the data stored) send user object
        // when jwt.verify is called we can obtain user data by decoded.user
        const token = jwt.sign({ user }, app.get('superSecret'), {
          expiresIn: 86400, // expires in 24 hours
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token,
        });
      }
    }
  });
});

// ---------------------------------------------------------
// Root API route for company (http://localhost:8080/api/company)
// ---------------------------------------------------------
apiRoutes.get('/company', (req, res) => {
  res.send(`Hello! This is API for company http://localhost:${port}/api/company/register to create your company account`);
});


// ---------------------------------------------------------
// Root API route for company to create an account (http://localhost:8080/api/company)
// ---------------------------------------------------------
apiRoutes.post('/company/register', (req, res) => {
  // create a sample user
  const newCompany = new Company({
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    admin: false,
  });
  newCompany.save((err) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    } else {
      // if there is no token
      // return an error
      res.json({ success: true });
    }
  });
});


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/company/authenticate
apiRoutes.post('/company/authenticate', (req, res) => {
  if (!req.body.email) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter email.' });
  } else if (!req.body.password) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter password.' });
  }

  // find the user
  Company.findOne({
    email: req.body.email,
  }, (err, company) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    }

    if (!company) {
      res.status(401).json({ success: false, message: 'Authentication failed. Email not found.' });
    } else if (company) {
      // check if password matches
      if (company.password !== req.body.password) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a toke
        // In the JWT's payload(where all the data stored) send user object
        // when jwt.verify is called we can obtain user data by decoded.user
        const token = jwt.sign({ company }, app.get('superSecret'), {
          expiresIn: 86400, // expires in 24 hours
        });

        res.status(200).json({
          success: true,
          message: 'Enjoy your token for your company!',
          token,
        });
      }
    }
  });
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.params.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(401).send({
      success: false,
      message: 'No token provided.',
    });
  }
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});
// ---------------------------------------------------------
// This route is to update student account information
// ---------------------------------------------------------
apiRoutes.put('/users', (req, res) => {
  if (!req.body.user) {
    return res.status(409).json({
      success: false,
      message: 'No data to update',
    });
  }
  User.findOneAndUpdate(
    // Query
    { _id: req.decoded.user._id },
    // Update
    {
      $set: req.body.user,
    },
    // When true the return is updated data
    // Run validators when updating
    {
      new: true,
      runValidators: true,
    },
    (err, updated) => {
      if (err) {
        res.status(409).json(err);
      } else if (!updated) {
        res.status(400).json(
          {
            success: false,
            message: 'Could not find user information',
          },
        );
      } else {
        // success
        res.json(updated);
      }
    },
  );
});

// ---------------------------------------------------------
// This route is used for user profile page (dashboard)
// ---------------------------------------------------------
apiRoutes.get('/user', (req, res) => {
  // find the user by username from JWT payload
  User.findOne({
    email: req.decoded.user.email,
  }, (err, user) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    } else if (!user) {
      // User not found
      return res.status(401).json({ success: false, message: 'email not found.' });
    } else if (user) {
      // User found
      res.status(200).json(user);
    }
  });
});

// ---------------------------------------------------------
// This route is to show all the users
// ---------------------------------------------------------
apiRoutes.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

// ---------------------------------------------------------
// This route is to check the payload (such as user information)
// ---------------------------------------------------------
apiRoutes.get('/check', (req, res) => {
  res.json(req.decoded);
});


// ---------------------------------------------------------
// This route is for query for students
// For example
// http://localhost:8080/api/search?key1=value1&key2=value2&key3=value3
// means
// {
//   "key1": "value1",
//   "key2": "value2",
//   "key3": "value3"
// }
// so if you want to find student who is Computer Science major and
// age 21 y.o. then do
// http://localhost:8080/api/search?major=computer science&age=21
// ---------------------------------------------------------
apiRoutes.get('/search', (req, res) => {
  User.find(req.query, (err, users) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: err,
      });
    }
    // No match found
    else if (!users || users.length === 0) {
      res.status(400).json({
        message: 'No match found',
      });
    }
    // Found one or more users
    else {
      res.json(users);
    }
  });
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log(`Magic happens at http://localhost:${port}`);

