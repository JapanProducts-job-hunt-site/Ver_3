// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../api/models/user');
const Company = require('../api/models/company');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

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
		it('it should return 200', (done) => {
			chai.request('http://localhost:' + port)
				.get('/')    
				.end((err, res) => {
					res.should.have.status(200);
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
		it('it should not POST with an empty username', (done) => {
			let user = {
				username: '',
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
		it('it should not POST with an empty name', (done) => {
			let user = {
				username: 'yuuki',
				password: '',
				name: '',
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
		it('it should not POST with an empty password', (done) => {
			let user = {
				username: 'yuuki',
				password: '',
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
					res.body.message.errors.should.have.property('password');
					done();
				});
		});
		it('it should not POST with an empty email', (done) => {
			let user = {
				username: 'yuuki',
				password: 'yuuukii',
				name: 'Yuuki',
				email: ''
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
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Username not found');
					done();
				});
		});
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
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Wrong password');
					done();
				});
		});
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
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter username');
					done();
				});
		});
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
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter password');
					done();
				});
		});
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
			done();
		});
		user1jwt = jwt.sign({ user: newuser1 }, process.env.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		user2jwt = jwt.sign({ user: newuser2 }, process.env.secret, {
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
		it('it should GET with correct JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api')
				.set('x-access-token', user1jwt)
				.end((err, res) => {
					res.should.have.status(200);
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
		it('it should GET with correct JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/user')
				.set('x-access-token', user1jwt)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('username');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.username.should.be.eql('user1');
					res.body.name.should.be.eql('User 1');
					res.body.email.should.be.eql('user1@yuuki.com');
					done();
				});
		});
		it('it should GET correct user information', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/user')
				.set('x-access-token', user2jwt)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('username');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.username.should.be.eql('user2');
					res.body.name.should.be.eql('User 2');
					res.body.email.should.be.eql('user2@yuuki.com');
					done();
				});
		});
	});

	///////////////////////////////////////////
	//             GET /api/check            //
	///////////////////////////////////////////
	describe('GET /api/check', () => {
		it('it should GET decoded JWT', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/check')
				.set('x-access-token', user1jwt)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('user');
					done();
				});
		});
	});
});



describe('Company', () => {

	// Remove all the data from test db
	before((done) => {
		Company.remove({}, (err) => {
			done();
		});
	});
	// Remove all the data from test db
	after((done) => {
		Company.remove({}, (err) => {
			console.log(err);
			done();
		});
	});
	///////////////////////////////////////////
	//             GET /company              //
	///////////////////////////////////////////
	describe('GET /company', () => {
		it('it should say Hello', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/company')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.should.have.property('text');
					res.text.should.be.a('string');
					res.text.should.include('Hello! This is API for company');
					done();
				});
		});
	});


	///////////////////////////////////////////
	//      POST /api/company/register       //
	///////////////////////////////////////////

	describe('POST /api/company/register', () => {
		it('it should return 403 without form data', (done) => {
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('username');
					res.body.message.errors.should.have.property('name');
					res.body.message.errors.should.have.property('password');
					res.body.message.errors.should.have.property('email');
					done();
				});
		});
		it('it should not POST and Company size should be 0', (done) => {
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('username');
					res.body.message.errors.should.have.property('name');
					res.body.message.errors.should.have.property('password');
					res.body.message.errors.should.have.property('email');
					Company.count({}, (err, c)=> {
						c.should.eql(0);
					});
					done();
				});
		});
		it('it should not POST without username', (done) => {
			let user = {
				password: 'password',
				name: 'Yuuki',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
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
		it('it should not POST without password', (done) => {
			let user = {
				username: 'Company 1',
				name: 'Yuuki',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('password');
					done();
				});
		});
		it('it should not POST without name', (done) => {
			let user = {
				username: 'Company 1',
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
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
		it('it should not POST without email', (done) => {
			let user = {
				username: 'Company 1',
				password: 'password',
				name: 'Yuuki'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
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
		it('it should POST with all properties', (done) => {
			let user = {
				username: 'Company 1',
				password: 'password',
				name: 'Yuuki',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
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

	///////////////////////////////////////////
	//    POST /api/company/authenticate     //
	///////////////////////////////////////////

	describe('POST /api/company/authenticate', () => {
		it('it should not POST with a wrong password', (done) => {
			let company = {
				username: 'Company 1',
				password: 'passworda',
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Wrong password');
					done();
				});
		});
		it('it should not POST without username', (done) => {
			let company = {
				password: 'password'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter username');
					done();
				});
		});
		it('it should not POST with a wrong username', (done) => {
			let company = {
				username: 'Company 1 ',
				password: 'password'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Username not found');
					done();
				});
		});
		it('it should not POST without password', (done) => {
			let company = {
				username: 'aaaa'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter password');
					done();
				});
		});
		it('it should POST with the correct username and password', (done) => {
			let company = {
				username: 'Company 1',
				password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					res.body.message.should.contain('Enjoy your token for your company!');
					res.body.should.have.property('token');
					done();
				});
		});
		it('it should POST with all properties', (done) => {
			let company = {
				username: 'Company 1',
				password: 'password',
				name: 'Yuuki',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
	});
});


	///////////////////////////////////////////
	//             GET /api/update           //
	///////////////////////////////////////////

describe('Update student information', () => {
	const users = [];
	const userJWTs = [];
	const SIZE = 10;
	let save_count = 0;

	before((done) => {
		User.remove({}, (err) => {
		});

		for(let i = 0; i < SIZE; i++){
			users.push(
				new User({ 
					username: "user" + i, 
					password: i,
					name: "User " + i,
					email: "user" + i + "@yuuki.com",
					admin: false 
				})
			);
			// register users
			users[i].save(function(err) {
				if (err) {
					console.log("[error] cound not save an user on db\n" + err)
				};

				save_count++;
				//Wait all saving is done
				if(save_count == SIZE) {
					done();
				}
			});
			userJWTs.push(
				jwt.sign({ user: users[i] }, process.env.secret, {
					expiresIn: 86400 // expires in 24 hours
				})
			);
		}
	});

	// Remove all the data from test db
	after((done) => {
		User.remove({}, (err) => {
			console.log(err);
			done();
		});
	});

	const URI = "/api/users" 
	describe('GET ' + URI, () => {
		it('Update username "user0" to "Updated"', (done) => {
			const USER_INDEX = 0;
			const DATA = {
				"user": {
					"username": "Updated"
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('username');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.username.should.be.eql('Updated');
					res.body.name.should.be.eql(users[USER_INDEX].name);
					res.body.email.should.be.eql(users[USER_INDEX].email);
					res.body.password.should.be.eql(users[USER_INDEX].password);
					done();
				});
		});
		it('Update username "user1" to "Updated 1" and email "updated1@yuuki.com"', (done) => {
			const USER_INDEX = 1;
			const DATA = {
				"user": {
					"username": "Updated 1",
					"email": "updated1@yuuki.com"
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('username');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.username.should.be.eql('Updated 1');
					res.body.name.should.be.eql(users[USER_INDEX].name);
					res.body.email.should.be.eql('updated1@yuuki.com');
					res.body.password.should.be.eql(users[USER_INDEX].password);
					done();
				});
		});
		it('Update all properties to "Updated 2"', (done) => {
			const USER_INDEX = 2;
			const DATA = {
				"user": {
					"username": "Updated 2",
					"name": "Updated 2",
					"email": "Updated 2",
					"password": "Updated 2"
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('username');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.username.should.be.eql('Updated 2');
					res.body.name.should.be.eql('Updated 2');
					res.body.email.should.be.eql('Updated 2');
					res.body.password.should.be.eql('Updated 2');
					done();
				});
		});
		it('Should return error if trying to set duplicate value', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"username": "Updated 2",
					"name": "Updated 2",
					"email": "Updated 2",
					"password": "Updated 2"
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('duplicate key error');
					res.body.message.should.contain('username');
					done();
				});
		});
		it('Should return duplicate email error if trying to set duplicate value', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"email": "Updated 2",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('duplicate key error');
					res.body.message.should.contain('email');
					done();
				});
		});
		it('Should return duplicate username error if trying to set duplicate value', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"username": "user9",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('duplicate key error');
					res.body.message.should.contain('username');
					done();
				});
		});
		it('Should return if username is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"username": "",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('username');
					done();
				});
		});
		it('Should return if name is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"name": "",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('name');
					done();
				});
		});
		it('Should return if email is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"email": "",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('email');
					done();
				});
		});
		it('Should return if password is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"password": "",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('password');
					done();
				});
		});
		it('it should return error if json is empty', (done) => {
			const DATA = {}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
				.set('x-access-token', userJWTs[0])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message')
					res.body.message.should.contain("No data to update");
					done();
				});
		});
		it('it should return error if no json is sent', (done) => {
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
				.set('x-access-token', userJWTs[0])
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message')
					res.body.message.should.contain("No data to update");
					done();
				});
		});
	});
});


  
	///////////////////////////////////////////
	//             GET /api/search           //
	///////////////////////////////////////////

describe('Search studetns', () => {
	const users = [];
	const SIZE = 10;
	let save_count = 0;

	let user0jwt;
	before((done) => {
		User.remove({}, (err) => {
		});

		for(let i = 0; i < SIZE; i++){
			users.push(
				new User({ 
					username: "user" + i, 
					password: i,
					name: "User " + i,
					email: "user" + i + "@yuuki.com",
					admin: false 
				})
			);
			// register users
			users[i].save(function(err) {
				if (err) {
					console.log("[error] cound not save an user on db\n" + err)
				};

				save_count++;
				//Wait all saving is done
				if(save_count == SIZE) {
					done();
				}
			});
		}
		user0jwt = jwt.sign({ user: users[0] }, process.env.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
	});

	// Remove all the data from test db
	after((done) => {
		User.remove({}, (err) => {
			console.log(err);
			done();
		});
	});

	///////////////////////////////////////////
	//            GET /api/search            //
	///////////////////////////////////////////
	describe('GET /api/search', () => {
		it('{} empty query should GET all users', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(SIZE);
					res.body[0].should.have.property('username');
					res.body[0].should.have.property('name');
					res.body[0].should.have.property('email');
					done();
				});
		});
		it('{ username:"user9" } should GET only user9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ username: "user9" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('username');
					res.body[0].username.should.be.eql('user9');
					res.body[0].should.have.property('name');
					res.body[0].name.should.be.eql('User 9');
					res.body[0].should.have.property('email');
					res.body[0].email.should.be.eql('user9@yuuki.com');
					done();
				});
		});
		it('{ name:"User 9" } should GET only user9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ username: "user9" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('username');
					res.body[0].username.should.be.eql('user9');
					res.body[0].should.have.property('name');
					res.body[0].name.should.be.eql('User 9');
					res.body[0].should.have.property('email');
					done();
				});
		});
		it('{ username:"user9" } should GET only user9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ username: "user9" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('username');
					res.body[0].username.should.be.eql('user9');
					res.body[0].should.have.property('name');
					res.body[0].name.should.be.eql('User 9');
					res.body[0].should.have.property('email');
					done();
				});
		});
	});
});
