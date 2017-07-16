var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	username: {
		type: String,
		unique: true,
		required: true
	}, 
	password: {
		type: String,
		required: true
	},
	admin: Boolean 
}));
