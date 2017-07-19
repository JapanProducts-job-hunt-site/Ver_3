// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

chai.use(chaiHttp);

describe('User', () => {
	beforeEach((done) => {
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
		it('it should not POST without email', (done) => {
			let user = {
				username: 'yuuking',
		    password: 'password',
		    name: 'Yuuki',
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
});
