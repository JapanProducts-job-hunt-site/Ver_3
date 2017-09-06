/**
 * This module manipulates all the HTTP requests
 * For API list, please check README.md
 */

const express = require('express');
const path = require('path');
const user = require('./user');
const company = require('./company');
const htmls = require('./htmls');
const validateJWT = require('./jwt').validateJWT;

const User = require('../models/user'); // get our mongoose model

const router = express.Router();

/**
 * GET /
 * Send html for landing page
 */

router.get('/', (req, res) => {
  const fileName = 'user/index.html';
  htmls.sendHtml(req, res, fileName);
});

/**
 * GET /company/
 * Send html for landing page
 */
router.get('/company', (req, res) => {
  const fileName = 'company/index.html';
  htmls.sendHtml(req, res, fileName);
});

/*
 * Routing for /api/*
 */
const apiRoutes = express.Router();

/*
 * POST /api/register
 * To register (sign up) new user (student)
 */
apiRoutes.post('/register', user.register);

/*
 * POST /api/authenticate
 * To authenticate (sign in) user (student)
 */
apiRoutes.post('/authenticate', user.authenticate);

/*
 * GET /api/company
 * Root route for company
 */
apiRoutes.get('/company', company.root);

/*
 * POST /api/company/register
 * To register new company (sign up)
 */
apiRoutes.post('/company/register', company.register);

/*
 * POST /api/company/authenticate
 * To authenticate company
 */
apiRoutes.post('/company/authenticate', company.authenticate);

/*
 * Use a middleware to validate JWT
 */
apiRoutes.use(validateJWT);

/*
 * *** Authenticated Route ***
 *  meaning user and company without valid JWT cannot access rotues below
 */

/*
 * GET /api
 * Root route for authenticated user
 */
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

/*
 * PUT /api/users
 * To update user (student) account information
 */
apiRoutes.put('/users', user.update);

/*
 * PUT /api/updatepassword
 * To update only password
 */
apiRoutes.put('/updatepassword', user.updatePassword);

/*
 * PUT /api/uploadimg
 * To upload/delete img
 */
apiRoutes.put('/uploadimg', user.uploadImage);

/*
 * GET /api/user
 * To get user (student) account information
 */
apiRoutes.get('/user', user.getAccountInfo);

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


/*
 * GET /api/search
 * To search user (student)
 */
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
apiRoutes.get('/search', user.search);

router.use('/api', apiRoutes);

module.exports = router;
