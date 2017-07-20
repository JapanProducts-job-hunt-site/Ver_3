// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/user');
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
const config = require('../config'); // get our config file

chai.use(chaiHttp);

describe('User', () => {
 
	// Remove all the data from test db
	before((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
	// Remove all the data from test db
	after((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
	///////////////////////////////////////////
	//                  GET /                //
	///////////////////////////////////////////
	describe('GET /', () => {
		it('it should say Hello', (done) => {
			chai.request('http://localhost:' + port)
				.get('/')    
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.should.have.property('text');
					res.text.should.be.a('string');
					res.text.should.include('Hello!');
					done();
				});
		});
	});
	

	///////////////////////////////////////////
	//          POST /api/register            //
	///////////////////////////////////////////
	
	describe('POST /api/register', () => {
		it('it should not POST without username', (done) => {
			let user = {
		    password: 'password',
		    name: 'Yuuki',
		    email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('username');
					done();
				});
		});
	});
	
	describe('POST /api/register', () => {
		it('it should not POST without name', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
		    email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('name');
					done();
				});
		});
	});
	describe('POST /api/register', () => {
		it('it should not POST without email', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
		    name: 'Yuuki'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('email');
					done();
				});
		});
	});
	describe('POST /api/register', () => {
		it('it should POST with all properties', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
		    name: 'Yuuki',
		    email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
	});
	describe('POST /api/register', () => {
		it('it should not POST with a duplicate username', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
		    name: 'Yuuki',
		    email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errmsg');
					res.body.message.errmsg.should.contain('duplicate key');
					res.body.message.errmsg.should.contain('username');
					done();
				});
		});
	});
	describe('POST /api/register', () => {
		it('it should not POST with a duplicate email', (done) => {
			let user = {
				username: 'yuuking2',
		    password: 'password',
		    name: 'Yuuki',
		    email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errmsg');
					res.body.message.errmsg.should.contain('email');
					done();
				});
		});
	});
	describe('POST /api/register', () => {
		it('it should POST with a different username and email', (done) => {
			let user = {
				username: 'yuuking2',
		    password: 'password',
		    name: 'Yuuki',
		    email: 'yuuki2@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
	});
	describe('POST /api/authenticate', () => {
		it('it should not POST with a unregistered username', (done) => {
			let user = {
				username: 'yuukin',
		    password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post('/api/authenticate')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Username not found');
					done();
				});
		});
	});
	describe('POST /api/authenticate', () => {
		it('it should not POST with a wrong password', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'passworda',
			}
			chai.request('http://localhost:' + port)
				.post('/api/authenticate')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Wrong password');
					done();
				});
		});
	});
	describe('POST /api/authenticate', () => {
		it('it should not POST without username', (done) => {
			let user = {
				username: '',
		    password: 'passworda',
			}
			chai.request('http://localhost:' + port)
				.post('/api/authenticate')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter username');
					done();
				});
		});
	});
	describe('POST /api/authenticate', () => {
		it('it should not POST without password', (done) => {
			let user = {
				username: 'aaaa',
		    password: '',
			}
			chai.request('http://localhost:' + port)
				.post('/api/authenticate')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter password');
					done();
				});
		});
	});
	describe('POST /api/authenticate', () => {
		it('it should POST with the correct username and password', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post('/api/authenticate')
			  .set('content-type', 'application/x-www-form-urlencoded')
			  .send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					res.body.message.should.contain('Enjoy your token!');
					res.body.should.have.property('token');
					done();
				});
		});
	});
});

describe('JSON Web Token', () => {
	let user1jwt;
	let user2jwt;
	before((done) => {
		User.remove({}, (err) => {
			done();
		});
		// register users
		var newuser1 = new User({ 
			username: "user1", 
			password: "11111",
			name: "User 1",
			email: "user1@yuuki.com",
			admin: false 
		});
		var newuser2 = new User({ 
			username: "user2", 
			password: "11111",
			name: "User 2",
			email: "user2@yuuki.com",
			admin: false 
		});
		newuser1.save(function(err) {
			if (err) {
				console.log("[error] cound not save an user on db")
			};
		});
		newuser2.save(function(err) {
			if (err) {
				console.log("[error] cound not save an user on db")
			};
		});
		user1jwt = jwt.sign({ user: newuser1 }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		user2jwt = jwt.sign({ user: newuser2 }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
	});
	// Remove all the data from test db
	after((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
	///////////////////////////////////////////
	//               GET /api                //
	///////////////////////////////////////////
	describe('GET /api', () => {
		it('it should not GET without a correct JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('No token provided.');
					done();
				});
		});
	});
	describe('GET /api', () => {
		it('it should GET with correct JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api')
			  .set('x-access-token', user1jwt)
				.end((err, res) => {
					res.should.have.status(200);
					console.log(res.body);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.message.should.contain('Welcome to the coolest API on earth!');
					done();
				});
		});
	});
	///////////////////////////////////////////
	//             GET /api/user             //
	///////////////////////////////////////////
	describe('GET /api/user', () => {
		it('it should not GET without JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/user')
			  .set('content-type', 'application/x-www-form-urlencoded')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('No token provided.');
					done();
				});
		});
	});
	describe('GET /api/user', () => {
		it('it should not GET with incorrect JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/user')
			  .set('x-access-token', 'Wrong Token')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('Failed to authenticate token.');
					done();
				});
		});
	});
});
