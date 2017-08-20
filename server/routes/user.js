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
      const token = jwt.sign({ user }, process.env.secret, {
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
  if (!req.body.user) {
    return res.status(409).json({
      success: false,
      message: 'No data to update',
    });
  }
  // User.findOneAndUpdate(
  //   // Query
  //   // { _id: req.decoded.user._id },
  //   { email: req.decoded.user.email },
  //   // Update
  //   {
  //     $set: req.body.user,
  //   },
  //   // When true the return is updated data
  //   // Run validators when updating
  //   {
  //     new: true,
  //     runValidators: true,
  //   },
  //   (err, updated) => {
  //     if (err) {
  //       res.status(409).json(err);
  //     } else if (!updated) {
  //       res.status(400).json({
  //         success: false,
  //         message: 'Could not find user information',
  //       });
  //     } else {
  //       // success
  //       // Update JWT
  //       const token = jwt.sign({ user: updated }, process.env.secret, {
  //         expiresIn: 86400, // expires in 24 hours
  //       });
  //       res.json({
  //         firstName: updated.firstName,
  //         lastName: updated.lastName,
  //         password: updated.password,
  //         email: updated.email,
  //         token,
  //       });
  //     }
  //   },
  // );
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
 * To get user account information
 */
exports.getAccountInfo = (req, res) => {
  // find the user by username from JWT payload
  User.findOne({
    email: req.decoded.user.email,
  }, (err, user) => {
    if (err) {
      res.status(HTTPStatus.UNAUTHORIZED).send({
        success: false,
        message: err,
      });
    } else if (!user) {
      // User not found
      return res.status(HTTPStatus.UNAUTHORIZED).json({ success: false, message: 'email not found.' });
    } else if (user) {
      // User found
      res.status(200).json(user);
    }
  });
};

/*
 * To search user (student)
 */
exports.search = (req, res) => {
  User.find(req.query, (err, users) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: err,
      });
    } else if (!users || users.length === 0) {
    // No match found
      res.status(400).json({
        message: 'No match found',
      });
    } else {
    // Found one or more users
      res.json(users);
    }
  });
};
