var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	name: {
		type: String,
		index: { unique: true }
	}, 
	password: String, 
	admin: Boolean 
}));
