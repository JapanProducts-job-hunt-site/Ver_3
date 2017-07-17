// =================================================================
// get the packages we need ========================================
// =================================================================
const express 	= require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file
const User   = require('./api/models/user'); // get our mongoose model

// =================================================================
// configuration ===================================================
// =================================================================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

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
// app.get('/', function(req, res) {
// 	res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

apiRoutes.post('/register', function(req, res) {

	console.log('Register: ' + req.body.username + ' : ' + req.body.password)
	// create a sample user
	var newUser = new User({ 
		username: req.body.username, 
		password: req.body.password,
		name: req.body.name,
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
			console.log('User saved successfully');
			res.json({ success: true });
		}
	});
});



// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

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
				console.log("[JWT authenticated route] User: " + decoded.user.username);
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
		};
		// User not found
		if (!user) {
			res.json({ success: false, message: 'Username not found.' });
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

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

