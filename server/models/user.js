const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SaltRoud = 10;

// set up a mongoose model
// const Model = mongoose.model('User', new Schema({
const UserSchema = new Schema({
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
});

/**
 * Mongoose middleware to crypt password
 * before it is saved on database
 * NOTE cannot user arrow function
 * because it cannot access *this*
 */

const cryptPassword = function (next) {
  // console.log('In crypting')
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // console.log('PW is isModified')
  // generate a salt
  bcrypt.genSalt(SaltRoud, (errSalt, salt) => {
    if (errSalt) return next(errSalt);

    // hash the password along with our new salt
    bcrypt.hash(this.password, salt, (errHash, hash) => {
      if (errHash) return next(errHash);
      // override the cleartext password with the hashed one
      this.password = hash;
      next();
    });
  });
};

/**
 * Set middleware for pre save
 */
UserSchema.pre('save', cryptPassword);

/**
 * Set middleware for pre findOneAndUpdate
 */
// UserSchema.pre('findOneAndUpdate', cryptPassword);

/**
 * Method to compare hashed password
 */
// UserSchema.methods.validatePassword = (candidatePassword, cb) => {
const validatePassword = (candidatePassword, hashedPassword, cb) => {
  bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
    console.log('candidate PW')
    console.log('is Match ' + isMatch)
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


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
        validatePassword(password, user.password, (errValidate, isMatch) => {
          if (errValidate) {
            console.log('Err validate');
            reject({
              success: false,
              message: 'Authentication failed. Wrong password.',
            });
          } else if (!isMatch) {
            console.log('Wrong password in route');
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
        });
      }
    });
  });

/*
 * Update user information
 */
const update = (email, newUser) =>
  new Promise((resolve, reject) => {
    Model.findOneAndUpdate(
      // Query
      { email },
      // { email: '1yuuki@yuuki.com' },
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
          console.log('updated user ' + updated)
          console.log('err ' + err)
          // Updated not defined
          reject({
            success: false,
            statusCode: 400,
            message: 'Could not find user information',
          });
        } else {
          console.log('Email: ' + email)
          // success
          resolve(updated);
        }
      },
    );
  });

/*
 * To find user by email
 * return User object
 */
const findUserByEmail = email =>
  new Promise((resolve, reject) => {
    // find the user by username from JWT payload
    Model.findOne({
      email,
    }, (err, user) => {
      if (err) {
        reject({
          success: false,
          message: err,
        });
      } else if (!user) {
        // User not found
        reject({
          success: false,
          message: 'email not found.',
        });
      } else if (user) {
        // User found
        resolve(user);
      }
    });
  });

/**
 * Method to update password
 * Precondition: all params have to exist
 * user object has to contain
 * email
 * oldPassword
 * newPassowrd
 */
UserSchema.statics.updatePassword =
  function updatePassword(user, cb) {
    // if (!user) {
    //   // user is undefined
    //   cb('User is undefined');
    // } else if (!user.email) {
    //   // email is undefined
    //   cb('email is undefined');
    // } else if (!user.oldPassword) {
    //   // oldPassword is undefined
    //   cb('oldPassword is undefined');
    // } else if (!user.newPassword) {
    //   // newPassword is undefined
    //   cb('newPassword is undefined');
    // }
    // Validate input with email and oldPassword
    console.log('in the methods')
    this.findOne({ email: user.email }, (err, foundUser) => {
      if (err) {
        // Error while searching
        cb('Error occured while finding user')
      } else if (!foundUser) {
        // No user found with email from JWT
        cb('No user found')
      } else {
        // Found user
        console.log('Found user')
        // Check if the old password is valid
        validatePassword(user.oldPassword, foundUser.password, (err, isMatch) => {
          if (err) {
            console.log(err)
          } else if (!isMatch) {
            console.log('Password is wrong')
          } else {
            // If valid
            // hash the password
            bcrypt.genSalt(SaltRoud, (errSalt, salt) => {
              if (errSalt) cb(errSalt);
              // hash the password along with our new salt
              bcrypt.hash(user.newPassword, salt, (errHash, hash) => {
                if (errHash) cb(errHash);
                // update password with hashed password
                foundUser.password = hash;
                foundUser.save((updateErr, updatedUser) => {
                  if (updateErr) {
                    console.log('Update err')
                  } else if (!updatedUser) {
                    console.log('Update user undefined')
                  } else {
                    // Success
                    cb(null, updatedUser);
                  }
                });
              });
            });
          }
        });
      }
    });
  };

/**
 * Method to search student
 */
const search = query =>
  new Promise((resolve, reject) => {
    Model.find(query, (err, users) => {
      if (err) {
        reject({
          success: false,
          message: err,
        });
      } else if (!users || users.length === 0) {
        // No match found
        reject({
          message: 'No match found',
        });
      } else {
        // Found one or more users
        resolve(users);
      }
    });
  });

const Model = mongoose.model('User', UserSchema);

module.exports = {
  Model,
  create,
  authenticate,
  update,
  findUserByEmail,
  search,
};
