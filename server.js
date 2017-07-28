// =================================================================
// get the packages we need ========================================
// =================================================================
const express 	= require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User   = require('./api/models/user'); // get our mongoose model
const Company   = require('./api/models/company'); // get our mongoose model

// To use .env file
require('dotenv').config();

// =================================================================
// configuration ===================================================
// =================================================================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

// To avoid error of mongoose mpromise DeprecationWarning
mongoose.Promise = global.Promise;

//don't show the log when it is test
// Connect to test db when it is test
if(process.env.NODE_ENV !== 'test') {
	//use morgan to log at command line
	app.use(morgan('dev'));
	// Connect to read database
	mongoose.connect(process.env.database);
}
else if(process.env.NODE_ENV === 'test') {
	// Connect to test database
	mongoose.connect(process.env.test_db); 
}

app.set('superSecret', process.env.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Tell the server to look at these directories to look for static files
app.use(express.static('./static/'));
app.use(express.static('./client/dist/'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({ 
		name: 'Nick Cerminara', 
		password: 'password',
		admin: true 
	});
	nick.save(function(err) {

		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		};

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

apiRoutes.post('/register', function(req, res) {

	// create a sample user
	var newUser = new User({ 
		username: req.body.username, 
		password: req.body.password,
		name: req.body.name,
		email: req.body.email,
		admin: false 
	});
	newUser.save(function(err) {
		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		} else {
			// if there is no token
			// return an error
			res.json({ success: true });
		}
	});
});



// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	if(!req.body.username){
		return res.json({ success: false, message: 'Authentication failed. Enter username.' });
	} else if(!req.body.password){
		return res.json({ success: false, message: 'Authentication failed. Enter password.' });
	}

	// find the user
	User.findOne({
		username: req.body.username
	}, function(err, user) {

		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		};

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. Username not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a toke
				// In the JWT's payload(where all the data stored) send user object
				// when jwt.verify is called we can obtain user data by decoded.user
				var token = jwt.sign({ user: user }, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		
		}
	});
});

// ---------------------------------------------------------
// Root API route for company (http://localhost:8080/api/company)
// ---------------------------------------------------------
apiRoutes.get('/company', function(req, res) {
	res.send('Hello! This is API for company http://localhost:' + port + '/api/company/register to create your company account');
});


// ---------------------------------------------------------
// Root API route for company to create an account (http://localhost:8080/api/company)
// ---------------------------------------------------------
apiRoutes.post('/company/register', function(req, res) {

	// create a sample user
	var newCompany = new Company({ 
		username: req.body.username, 
		password: req.body.password,
		name: req.body.name,
		email: req.body.email,
		admin: false 
	});
	newCompany.save(function(err) {
		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		} else {
			// if there is no token
			// return an error
			res.json({ success: true });
		}
	});
});


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/company/authenticate
apiRoutes.post('/company/authenticate', function(req, res) {

	if(!req.body.username){
		return res.json({ success: false, message: 'Authentication failed. Enter username.' });
	} else if(!req.body.password){
		return res.json({ success: false, message: 'Authentication failed. Enter password.' });
	}

	// find the user
	Company.findOne({
		username: req.body.username
	}, function(err, company) {

		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		};

		if (!company) {
			res.json({ success: false, message: 'Authentication failed. Username not found.' });
		} else if (company) {

			// check if password matches
			if (company.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a toke
				// In the JWT's payload(where all the data stored) send user object
				// when jwt.verify is called we can obtain user data by decoded.user
				var token = jwt.sign({ company: company }, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token for your company!',
					token: token
				});
			}		
		}
	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});
	} 
	else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

// ---------------------------------------------------------
// This route is to update student account information 
// ---------------------------------------------------------
apiRoutes.put('/update', function(req, res) {
	if(!req.body.user) {
		return res.json({
			success: false,
			message: "No data to update"
		})
	}
	User.findOneAndUpdate(
		//Query
	  { _id: req.decoded.user._id },
		//Update
		{
			$set: req.body.user 
		},
		// When true the return is updated data
		{ new: true },
		(err, updated) => {
			if(err) {
				res.json(err);
			} else if (!updated){
				res.json(
					{ 
						success: false, 
						message: "Could not find user information"
					}
				);
			} else {
				console.log("Updated " + updated);
				res.json(updated);
			}
		}
	);
});

// ---------------------------------------------------------
// This route is used for user profile page (dashboard)
// ---------------------------------------------------------
apiRoutes.get('/user', function(req, res) {
	// find the user by username from JWT payload
	User.findOne({
		username: req.decoded.user.username
	}, function(err, user) {

		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		}
		// User not found
		else if (!user) {
			return res.json({ success: false, message: 'Username not found.' });
		} 
		// User found
		else if (user) {
			res.json(user);
		}
	});
});

// ---------------------------------------------------------
// This route is to show all the users 
// ---------------------------------------------------------
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

// ---------------------------------------------------------
// This route is to check the payload (such as user information)
// ---------------------------------------------------------
apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});


// ---------------------------------------------------------
// This route is for query for students 
// For example
// http://localhost:8080/api/search?key1=value1&key2=value2&key3=value3 
// means 
// {
//   "key1": "value1",
//   "key2": "value2",
//   "key3": "value3"
// }
// so if you want to find student who is Computer Science major and
// age 21 y.o. then do
// http://localhost:8080/api/search?major=computer science&age=21 
// ---------------------------------------------------------
apiRoutes.get('/search', function(req, res) {
	User.find(req.query, function(err, users) {
		if (err) {
			res.status(403).send({
				success: false,
				message: err 
			});
		}
		// No match found
		else if(!users || users.length == 0){
			res.json({
				message:"No match found"
			});
		}
		// Found one or more users
		else {
			res.json(users);
		};
	});
});

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

