const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SaltRound = 10;

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
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SaltRound, (errSalt, salt) => {
    if (errSalt) return next(errSalt);

    // hash the password along with our new salt
    bcrypt.hash(this.password, salt, (errHash, hash) => {
      if (errHash) return next(errHash);
      // override the cleartext password with the hashed one
      this.password = hash;
      return next();
    });
  });
};

/**
 * Set middleware for pre save
 */
UserSchema.pre('save', cryptPassword);

/**
 * Method to compare hashed password
 */
const validatePassword = (candidatePassword, hashedPassword, cb) => {
  bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

/**
 * Support function to find one user by email
 */
UserSchema.statics.findOneUserByEmail = function findOneUserByEmail(email, cb) {
  this.findOne({ email }, (err, foundUser) => {
    if (err) {
      cb(err.message);
    } else if (!foundUser) {
      // cb('No user found by email');
      cb();
    } else {
      cb(null, foundUser);
    }
  });
};

/**
 * Below is methods used by routes
 */

/**
 * To create new user
 * all parameters have to be valid ( cannot be null or undefined)
 */
UserSchema.statics.create = function create(firstName, lastName, password, email, cb) {
  const newUser = new this({
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
      cb(err.message);
    } else {
      // Success
      cb(null, newUser);
    }
  });
};

/**
 * To authenticate user
 * All parameters have to be valid
 */

UserSchema.statics.authorize = function authorize(password, email, cb) {
  this.findOne({
    email,
  }, (err, user) => {
    if (err) {
      // Database error
      cb(err);
    } else if (!user) {
      // No user found by the email
      cb('Authentication failed. Email not found.');
    } else if (user) {
      // check if password matches
      validatePassword(password, user.password, (errValidate, isMatch) => {
        if (errValidate) {
          cb('Authentication failed. Wrong password.');
        } else if (!isMatch) {
          cb('Authentication failed. Wrong password.');
        } else {
          // if user is found and password is right
          cb(null, user);
        }
      });
    }
  });
};

/*
 * Update user information
 */
UserSchema.statics.updateData = function updateData(email, newUser, cb) {
  this.findOneAndUpdate(
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
        cb(err.message);
      } else if (!updated) {
        // Updated not defined
        cb('Could not find user information');
      } else {
        // success
        cb(null, updated);
      }
    },
  );
};

/*
 * To find user by email
 * return User object
 */
UserSchema.statics.getUser = function getUser(email, cb) {
   this.findOneUserByEmail(email, (err, user) => {
     if (err) {
       console.log('err' + err)
       cb(err);
     } else if (!user) {
       // User not found
       console.log('No user')
       cb('No user found by email not found.');
     } else if (user) {
       console.log('found user')
       // User found
       cb(null, user);
     }
   });
  // this.findOne({
  //   email,
  // }, (err, user) => {
  //   if (err) {
  //     cb(err.message);
  //   } else if (!user) {
  //     // User not found
  //     cb('email not found.');
  //   } else if (user) {
  //     // User found
  //     cb(null, user);
  //   }
  // });
};


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
    if (!user) {
      // user is undefined
      cb('User is undefined');
    } else if (!user.email) {
      // email is undefined
      cb('email is undefined');
    } else if (!user.oldPassword) {
      // oldPassword is undefined
      cb('oldPassword is undefined');
    } else if (!user.newPassword) {
      // newPassword is undefined
      cb('newPassword is undefined');
    }
    // Validate input with email and oldPassword
    this.findOne({ email: user.email }, (err, foundUser) => {
      if (err) {
        // Error while searching
        cb('Error occured while finding user')
      } else if (!foundUser) {
        // No user found with email from JWT
        cb('No user found')
      } else {
        // Found user
        // Check if the old password is valid
        validatePassword(user.oldPassword, foundUser.password, (err, isMatch) => {
          if (err) {
            cb(err);
          } else if (!isMatch) {
            cb('Password is wrong');
          } else {
            // If valid
            // Update password with newPassword
            foundUser.password = user.newPassword;
            foundUser.save((updateErr, updatedUser) => {
              if (updateErr) {
                cb(updateErr);
              } else if (!updatedUser) {
                cb('Update user undefined');
              } else {
                // Success
                cb(null, updatedUser);
              }
            });
          }
        });
      }
    });
  };

/**
 * Method to search student
 */
UserSchema.statics.getUsers = function getUsers(query, cb) {
  this.find(query, (err, users) => {
    if (err) {
      cb(err.message);
    } else if (!users || users.length === 0) {
      // No match found
      cb('No match found');
    } else {
      // Found one or more users
      cb(null, users);
    }
  });
};

const Model = mongoose.model('User', UserSchema);

module.exports = {
  Model,
};
