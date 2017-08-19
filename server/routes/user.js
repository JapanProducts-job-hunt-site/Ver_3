/**
 * This file contains the main part of manipulating the HTTP requests
 */
const jwt = require('jsonwebtoken');
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
    return res.status(401).json({ success: false, message: 'Registration failed. Enter first name.' });
  } else if (!req.body.lastName) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter last name.' });
  } else if (!req.body.password) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter password.' });
  } else if (!req.body.email) {
    return res.status(401).json({ success: false, message: 'Registration failed. Enter email.' });
  }
  // create a new user
  // const newUser = new User({
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   password: req.body.password,
  //   email: req.body.email,
  //   admin: false,
  // });
  // newUser.save((err) => {
  //   if (err) {
  //     return res.status(401).send({
  //       success: false,
  //       message: err,
  //     });
  //   }
  //   return res.json({ success: true });
  // });
  console.log('before promise')
  tempUser.create(
    req.body.firstName,
    req.body.lastName,
    req.body.password,
    req.body.email,
  )
    .then(fulfilled => res.status(200).json(fulfilled))
  // .then(fulfilled => {
  //   console.log('Fulfilled')
  //   res.status(200).json(fulfilled)
  // })
    .catch(err => res.status(401).send(err));
  // .catch(err => {
  //   console.log('error')
  //   res.status(401).send(err)
  // })
};

/*
 * Route for authentication
 */
exports.authenticate = (req, res) => {
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
        const token = jwt.sign({ user }, process.env.secret, {
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
        res.status(400).json({
          success: false,
          message: 'Could not find user information',
        });
      } else {
        // success
        res.json(updated);
      }
    },
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
