/**
 * This file contains the main part of manipulating the HTTP requests
 */
const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');
const User = require('../models/user').Model;
// const tempUser = require('../models/user');

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
  User.create(
    req.body.firstName,
    req.body.lastName,
    req.body.password,
    req.body.email,
    (err, newUser) => {
      if (err) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: err,
          success: false,
        });
      } else if (!newUser) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: 'Could not create new user',
          success: false,
        });
      } else {
        res.status(HTTPStatus.OK).json({
          newUser,
          success: true,
        });
      }
    },
  );
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
  User.authorize(
     req.body.password,
     req.body.email,
    (err, authorizedUser) => {
      if (err) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: err,
          success: false,
        });
      } else if (!authorizedUser) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: err,
          success: false,
        });
      } else {
        // create a token
        // In the JWT's payload(where all the data stored) send user object
        // when jwt.verify is called we can obtain user data by decoded.user
        // const token = jwt.sign({ user }, process.env.secret, {
        const token = jwt.sign({ user: authorizedUser }, process.env.secret, {
          expiresIn: 86400, // expires in 24 hours
        });
        res.status(HTTPStatus.OK).json({
          success: true,
          message: 'Enjoy your token!',
          token,
        });
      }
    },
  );
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
  User.updateData(
    req.decoded.user.email,
    req.body.user,
    (err, updated) => {
      if (err) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: err,
        });
      } else if (!updated) {
        res.status(HTTPStatus.UNAUTHORIZED).json({
          message: 'Err while updating',
        });
      } else {
        // create a token
        // In the JWT's payload(where all the data stored) send user object
        // when jwt.verify is called we can obtain user data by decoded.user
        //
        // ********* DO NOT CHANGE the key user ************
        // Otherwise, JWT does not work
        //
        const token = jwt.sign({ user: updated }, process.env.secret, {
          expiresIn: 86400, // expires in 24 hours
        });
        res.status(HTTPStatus.OK).json({
          firstName: updated.firstName,
          lastName: updated.lastName,
          password: updated.password,
          email: updated.email,
          token,
        });
      }
    });
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
      });
    }
  });
};

/*
 * To get user account information
 */
exports.getAccountInfo = (req, res) => {
  User.getUser(req.decoded.user.email, (err, user) => {
    if (err) {
      res.status(HTTPStatus.UNAUTHORIZED).json({
        messag: err,
      });
    } else if (!user) {
      res.status(HTTPStatus.UNAUTHORIZED).json({
        messag: 'No user found by the token',
      });
    } else {
      res.status(HTTPStatus.OK).json(user);
    }
  });
};

/*
 * To search user (student)
 */

exports.search = (req, res) => {
  if (!req.query) {
    res.status(400).json({
      message: 'Query undefined',
    });
  }
  User.getUsers(req.query, (err, users) => {
    if (err) {
      res.status(400).json(err);
    } else if (!users) {
      res.status(400).json('No user found');
    } else {
      res.status(HTTPStatus.OK).json(users);
    }
  });
};
