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
	//          GET /api/register            //
	///////////////////////////////////////////
	
	describe('GET /api/register', () => {
		it('it should not POST without username', (done) => {
			// chai.request(server)
			chai.request('http://localhost:' + port)
				.post('/api/register')
			  .set('content-type', 'application/x-www-form-urlencoded')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.should.have.property('text');
					res.text.should.be.a('string');
					res.text.should.include('Hello!');
					done();
				});
		});
	});
	
});
