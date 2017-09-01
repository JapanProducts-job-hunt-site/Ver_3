/**
 * This file contains the main part of manipulating the HTTP requests
 */
const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');
const User = require('../models/user').Model;
const tempUser = require('../models/user');


/*
 * Route for registration
 */
exports.register = (req, res) => {
  // Checking if all properties to create new user
  // * firstName
  // * lastName
  // * password
  // * email
  // are sent in body
  if (!req.body.firstName) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Registration failed. Enter first name.' });
  } else if (!req.body.lastName) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Registration failed. Enter last name.' });
  } else if (!req.body.password) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Registration failed. Enter password.' });
  } else if (!req.body.email) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Registration failed. Enter email.' });
  }

  /**
   * Create new user (student)
   */
  tempUser.create(
    req.body.firstName,
    req.body.lastName,
    req.body.password,
    req.body.email,
  )
  // Success
    .then(fulfilled => res.status(200).json(fulfilled))
  // Error
    .catch(err => res.status(HTTPStatus.UNAUTHORIZED).send(err));
};

/*
 * Route for authentication
 */
exports.authenticate = (req, res) => {
  if (!req.body.email) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Authentication failed. Enter email.' });
  } else if (!req.body.password) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'Authentication failed. Enter password.' });
  }

  /**
   * Authenticate user
   * provide JWT when authenticated
   */
  tempUser.authenticate(
    req.body.password,
    req.body.email,
  )
  // Success
    .then((user) => {
      // create a token
      // In the JWT's payload(where all the data stored) send user object
      // when jwt.verify is called we can obtain user data by decoded.user
      // const token = jwt.sign({ user }, process.env.secret, {
      const token = jwt.sign(user, process.env.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(HTTPStatus.OK).json({
        success: true,
        message: 'Enjoy your token!',
        token,
      });
    })
  // Error
    .catch(err => res.status(HTTPStatus.UNAUTHORIZED).send(err));
};

/*
 * Route for updading user (student information)
 */
exports.update = (req, res) => {
  /*
   * Validate param
   * If not data found, return 409
   */
  if (!req.body.user) {
    return res.status(409).json({
      success: false,
      message: 'No data to update',
    });
  } else if (req.body.user.password ||
  req.body.user.password === '') {
    /*
     * Password cannot be updated via this route
     * Use `PUT api/updatepassword`
     */
    return res.status(409).json({
      success: false,
      message: 'Password cannot be updated via this route',
    });
  }
  /*
   * Updated user
   */
  tempUser.update(
    req.decoded.user.email,
    req.body.user,
  )
  // Success
    .then((user) => {
      // create a token
      // In the JWT's payload(where all the data stored) send user object
      // when jwt.verify is called we can obtain user data by decoded.user
      const token = jwt.sign({ user }, process.env.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(HTTPStatus.OK).json({
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        email: user.email,
        token,
      });
    })
  // Error
    .catch(err =>
      res.status(err.statusCode).json({
        message: err.message,
      }),
    );
};

/*
 * To update passowrd
 */
exports.updatePassword = (req, res) => {
  if (!req.body.user.oldPassword) {
    return res.status(HTTPStatus.CONFLICT).json({
      success: false,
      message: 'No old password found',
    });
  } else if (!req.body.user.newPassword) {
    return res.status(HTTPStatus.CONFLICT).json({
      success: false,
      message: 'No new password found',
    });
  }
  User.updatePassword({
    email: req.decoded.user.email,
    oldPassword: req.body.user.oldPassword,
    newPassword: req.body.user.newPassword,
  }, (err, newUser) => {
    if (err) {
      return res.status(HTTPStatus.UNAUTHORIZED).json({
        success: false,
        message: err,
      });
    } else if (!newUser) {
      return res.status(HTTPStatus.CONFLICT).json({
        success: false,
        message: 'User not found',
      });
    } else {
      // Success
      return res.status(HTTPStatus.OK).json({
        message: 'Password updated',
      })
    }
  });
};

/*
 * To get user account information
 */
exports.getAccountInfo = (req, res) => {
  tempUser.findUserByEmail(req.decoded.user.email)
  .then(user => res.status(HTTPStatus.OK).json(user))
  .catch(err => res.status(HTTPStatus.UNAUTHORIZED).json(err));
};

/*
 * To search user (student)
 */
exports.search = (req, res) => {
  // User.find(req.query, (err, users) => {
  //   if (err) {
  //     res.status(400).send({
  //       success: false,
  //       message: err,
  //     });
  //   } else if (!users || users.length === 0) {
  //   // No match found
  //     res.status(400).json({
  //       message: 'No match found',
  //     });
  //   } else {
  //   // Found one or more users
  //     res.json(users);
  //   }
  // });
  tempUser.search(req.query)
    .then(users => res.status(HTTPStatus.OK).json(users))
    .catch(err => res.status(400).json(err));
};
