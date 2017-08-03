var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	firstName: {
		type: String,
		minlength: 1,
		required: true
	},
	lastName: {
		type: String,
		minlength: 1,
		required: true
	},
	password: {
		type: String,
		minlength: 1,
		required: true
	},
	email: {
		type: String,
		minlength: 1,
		unique: true,
		required: true
	},
	schoolName: {
		type: String,
	},
	major: {
		type: String,
	},
	admin: Boolean
}));
