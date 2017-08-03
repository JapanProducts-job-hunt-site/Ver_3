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
	const URI = '/api/register'

	describe('POST ' + URI, () => {
		it('it should POST', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
				email: '1yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
		it('it should POST with no username', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
				email: '2yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
		it('it should not POST with an empty firstName and password', (done) => {
			let user = {
				firstName: '',
				lastName: 'Kuroshima',
				password: '',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('first name');
					done();
				});
		});
		it('it should not POST with an empty password', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: '',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('password');
					done();
				});
		});
		it('it should not POST with an empty email', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'yuuukii',
				email: ''
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('email');
					done();
				});
		});
		it('it should not POST without first name', (done) => {
			let user = {
				lastName: 'Kuroshima',
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('first name');
					done();
				});
		});
		it('it should not POST without last name', (done) => {
			let user = {
				firstName: 'Yuuki',
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('last name');
					done();
				});
		});
		it('it should not POST without email', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.contain('email');
					done();
				});
		});
		it('it should POST with all properties', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.true;
					done();
				});
		});
		it('it should not POST with a duplicate email', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errmsg');
					res.body.message.errmsg.should.contain('email');
					done();
				});
		});
		it('it should POST with a different email', (done) => {
			let user = {
				firstName: 'Yuuki',
				lastName: 'Kuroshima',
				password: 'password',
				email: 'yuuki2@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post(URI)
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

	const URI_auth = '/api/authenticate'
	describe('POST ' + URI_auth, () => {
		it('it should not POST with a unregistered email', (done) => {
			let user = {
				email: 'yuuki@yuuki.com3',
				password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post(URI_auth)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Email not found');
					done();
				});
		});
		it('it should not POST with a wrong password', (done) => {
			let user = {
				email: 'yuuki2@yuuki.com',
				password: 'passworda',
			}
			chai.request('http://localhost:' + port)
				.post(URI_auth)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Wrong password');
					done();
				});
		});
		it('it should not POST without username', (done) => {
			let user = {
				email: '',
				password: 'passworda',
			}
			chai.request('http://localhost:' + port)
				.post(URI_auth)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter email');
					done();
				});
		});
		it('it should not POST without password', (done) => {
			let user = {
				email: 'aaaa',
				password: '',
			}
			chai.request('http://localhost:' + port)
				.post(URI_auth)
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter password');
					done();
				});
		});
		it('it should POST with the correct username and password', (done) => {
			let user = {
				email: 'yuuki@yuuki.com',
				password: 'password',
			}
			chai.request('http://localhost:' + port)
				.post(URI_auth)
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
			firstName: "First 1",
			lastName: "Last 1",
			password: "11111",
			email: "user1@yuuki.com",
			admin: false 
		});
		var newuser2 = new User({ 
			firstName: "First 2",
			lastName: "Last 2",
			password: "11111",
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
					res.should.have.status(401);
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
					res.should.have.status(401);
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
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.firstName.should.be.eql('First 1');
					res.body.lastName.should.be.eql('Last 1');
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
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.firstName.should.be.eql('First 2');
					res.body.lastName.should.be.eql('Last 2');
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
		it('it should return 401 without form data', (done) => {
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
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
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.should.have.property('message');
					res.body.message.should.have.property('errors');
					res.body.message.errors.should.have.property('name');
					res.body.message.errors.should.have.property('password');
					res.body.message.errors.should.have.property('email');
					Company.count({}, (err, c)=> {
						c.should.eql(0);
					});
					done(); });
		});
		it('it should not POST without password', (done) => {
			let user = {
				name: 'Yuuki',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
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
				password: 'password',
				email: 'yuuki@yuuki.com'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
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
				password: 'password',
				name: 'Yuuki'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
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
				email: 'yuuki@yuuki.com',
				password: 'passworda'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Wrong password');
					done();
				});
		});
		it('it should not POST without email', (done) => {
			let company = {
				password: 'password'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter email');
					done();
				});
		});
		it('it should not POST with a wrong email', (done) => {
			let company = {
				email: 'Company 1 ',
				password: 'password'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Email not found');
					done();
				});
		});
		it('it should not POST without password', (done) => {
			let company = {
				email: 'aaaa'
			}
			chai.request('http://localhost:' + port)
				.post('/api/company/authenticate')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send(company)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('success').that.to.be.false;
					res.body.message.should.contain('Enter password');
					done();
				});
		});
		it('it should POST with the correct username and password', (done) => {
			let company = {
				email: 'yuuki@yuuki.com',
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
					firstName: "First " + i,
					lastName: "Last " + i,
					password: i,
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
		it('first name to "Updated first 1" and email "updated1@yuuki.com"', (done) => {
			const USER_INDEX = 1;
			const DATA = {
				"user": {
					"firstName": "Updated first 1",
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
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.firstName.should.be.eql("Updated first 1");
					res.body.lastName.should.be.eql("Last 1");
					res.body.email.should.be.eql('updated1@yuuki.com');
					res.body.password.should.be.eql(users[USER_INDEX].password);
					done();
				});
		});
		it('last name to "Updated last 1"', (done) => {
			const USER_INDEX = 1;
			const DATA = {
				"user": {
					"lastName": "Updated last 1",
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.firstName.should.be.eql("Updated first 1");
					res.body.lastName.should.be.eql("Updated last 1");
					res.body.email.should.be.eql('updated1@yuuki.com');
					res.body.password.should.be.eql(users[USER_INDEX].password);
					done();
				});
		});
		it('Update all properties to "Updated 2"', (done) => {
			const USER_INDEX = 2;
			const DATA = {
				"user": {
					"firstName": "Updated 2",
					"lastName": "Updated 2",
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
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('password');
					res.body.firstName.should.be.eql('Updated 2');
					res.body.lastName.should.be.eql('Updated 2');
					res.body.email.should.be.eql('Updated 2');
					res.body.password.should.be.eql('Updated 2');
					done();
				});
		});
		it('Should return error if trying to set duplicate value', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"firstName": "Updated frist 1",
					"lastName": "Updated last 1",
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
					res.should.have.status(409);
					res.body.should.have.property('message');
					res.body.message.should.contain('duplicate key error');
					res.body.message.should.contain('email');
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
					res.should.have.status(409);
					res.body.should.have.property('message');
					res.body.message.should.contain('duplicate key error');
					res.body.message.should.contain('email');
					done();
				});
		});
		it('Should return if first name is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"firstName": ""
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('firstName');
					done();
				});
		});
		it('Should return if last name is empty', (done) => {
			const USER_INDEX = 3;
			const DATA = {
				"user": {
					"lastName": ""
				}
			}
			chai.request('http://localhost:' + port)
				.put(URI)
				.set('Content-Type', 'application/json')
			 	.set('x-access-token', userJWTs[USER_INDEX])
			  .send(DATA)
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('message');
					res.body.message.should.contain('required');
					res.body.message.should.contain('lastName');
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
					res.should.have.status(409);
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
					res.should.have.status(409);
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
					res.should.have.status(409);
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
					res.should.have.status(409);
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
					firstName: "First " + i,
					lastName: "Last " + i,
					email: "user" + i + "@yuuki.com",
					password: i,
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
					res.body[0].should.have.property('firstName');
					res.body[0].should.have.property('lastName');
					res.body[0].should.have.property('email');
					done();
				});
		});
		it('{ email:"user9@yuuki.com" } should GET only User 9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ email: "user9@yuuki.com" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('firstName');
					res.body[0].should.have.property('lastName');
					res.body[0].firstName.should.be.eql('First 9');
					res.body[0].lastName.should.be.eql('Last 9');
					res.body[0].should.have.property('email');
					res.body[0].email.should.be.eql('user9@yuuki.com');
					done();
				});
		});
		it('{ firstName :"First 9" } should GET only user9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ firstName: "First 9" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('firstName');
					res.body[0].should.have.property('lastName');
					res.body[0].firstName.should.be.eql('First 9');
					res.body[0].lastName.should.be.eql('Last 9');
					res.body[0].should.have.property('email');
					done();
				});
		});
		it('{ lastName:"Last 9" } should GET only user9', (done) => {
			chai.request('http://localhost:' + port)
				.get('/api/search')
				.set('x-access-token', user0jwt)
				.query({ lastName: "Last 9" })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.lengthOf(1);
					res.body[0].should.have.property('firstName');
					res.body[0].should.have.property('lastName');
					res.body[0].firstName.should.be.eql('First 9');
					res.body[0].lastName.should.be.eql('Last 9');
					res.body[0].should.have.property('email');
					done();
				});
		});
	});
});
