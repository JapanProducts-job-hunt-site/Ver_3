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
					res.should.have.status(200);
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
					res.should.have.status(200);
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
					res.should.have.status(200);
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
					res.should.have.status(200);
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
		});
		user1jwt = jwt.sign({ user: newuser1 }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		user2jwt = jwt.sign({ user: newuser2 }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		done();
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
		user0jwt = jwt.sign({ user: users[0] }, config.secret, {
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
