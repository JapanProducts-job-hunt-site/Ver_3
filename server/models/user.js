const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// set up a mongoose model
// module.exports = mongoose.model('User', new Schema({
// 	firstName: {
// 		type: String,
// 		minlength: 1,
// 		required: true
// 	},
// 	lastName: {
// 		type: String,
// 		minlength: 1,
// 		required: true
// 	},
// 	password: {
// 		type: String,
// 		minlength: 1,
// 		required: true
// 	},
// 	email: {
// 		type: String,
// 		minlength: 1,
// 		unique: true,
// 		required: true
// 	},
// 	schoolName: {
// 		type: String,
// 	},
// 	major: {
// 		type: String,
// 	},
// 	admin: Boolean
// }));
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

module.exports = {
  Model,
  create,
};
