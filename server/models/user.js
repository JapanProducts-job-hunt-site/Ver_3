const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// set up a mongoose model
// const Model = mongoose.model('User', new Schema({
const Model = mongoose.model('User', new Schema({
  firstName: {
    type: String,
    minlength: 1,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 1,
    required: true,
  },
  password: {
    type: String,
    minlength: 1,
    required: true,
  },
  email: {
    type: String,
    minlength: 1,
    unique: true,
    required: true,
  },
  schoolName: {
    type: String,
  },
  major: {
    type: String,
  },
  admin: Boolean,
}));

/**
 * To create new user
 * all parameters have to be valid ( cannot be null or undefined)
 */
const create = (firstName, lastName, password, email) =>
  new Promise((resolve, reject) => {
    const newUser = new Model({
      firstName,
      lastName,
      password,
      email,
      admin: false,
    });
    newUser.save((err) => {
      if (err) {
        // Something went wrong
        // Return with error message
        reject({
          success: false,
          message: err,
        });
      } else {
        // Success
        resolve({
          success: true,
        });
      }
    });
  });

/**
 * To authenticate user
 * All parameters have to be valid
 */
const authenticate = (password, email) =>
  new Promise((resolve, reject) => {
    // find the user
    Model.findOne({
      email,
    }, (err, user) => {
      if (err) {
        // Database error
        reject({
          success: false,
          message: err,
        });
      } else if (!user) {
        // No user found by the email
        reject({
          success: false,
          message: 'Authentication failed. Email not found.',
        });
      } else if (user) {
        // check if password matches
        if (user.password !== password) {
          // Wrong password
          reject({
            success: false,
            message: 'Authentication failed. Wrong password.',
          });
        } else {
          // if user is found and password is right
          resolve({
            user,
          });
        }
      }
    });
  });

const update = (email, newUser) =>
  new Promise((resolve, reject) => {
    Model.findOneAndUpdate(
      // Query
      { email },
      // Update
      {
        $set: newUser,
      },
      // When true the return is updated data
      // Run validators when updating
      {
        new: true,
        runValidators: true,
      },
      (err, updated) => {
        if (err) {
          // error
          reject({
            message: err.message,
            statusCode: 409,
          });
        } else if (!updated) {
          // Updated not defined
          reject({
            success: false,
            statusCode: 400,
            message: 'Could not find user information',
          });
        } else {
          // success
          resolve(updated);
        }
      },
    );
  });

module.exports = {
  Model,
  create,
  authenticate,
  update,
};
