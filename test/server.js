// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

require('dotenv').config();

const User = require('../server/models/user').Model;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

chai.use(chaiHttp);

describe('JSON Web Token', () => {
  let user1jwt;
  let user2jwt;
  before((done) => {
    User.remove({}, (err) => {
    });
    // register users
    const newuser1 = new User({
      firstName: 'First 1',
      lastName: 'Last 1',
      password: '11111',
      email: 'user1@yuuki.com',
      admin: false,
    });
    const newuser2 = new User({
      firstName: 'First 2',
      lastName: 'Last 2',
      password: '11111',
      email: 'user2@yuuki.com',
      admin: false,
    });
    newuser1.save((err) => {
      if (err) {
        console.log('[error] cound not save an user on db');
      }
    });
    newuser2.save((err) => {
      if (err) {
        console.log('[error] cound not save an user on db');
      }
      done();
    });
    user1jwt = jwt.sign({ user: newuser1 }, process.env.secret, {
      expiresIn: 86400, // expires in 24 hours
    });
    user2jwt = jwt.sign({ user: newuser2 }, process.env.secret, {
      expiresIn: 86400, // expires in 24 hours
    });
  });
  // Remove all the data from test db
  after((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  // /////////////////////////////////////////
  //               GET /api                //
  // /////////////////////////////////////////
  describe('GET /api', () => {
    it('it should not GET without a correct JWT', (done) => {
      chai.request(`http://localhost:${port}`)
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
      chai.request(`http://localhost:${port}`)
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

  // /////////////////////////////////////////
  //             GET /api/user             //
  // /////////////////////////////////////////
  describe('GET /api/user', () => {
    it('it should not GET without JWT', (done) => {
      chai.request(`http://localhost:${port}`)
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
      chai.request(`http://localhost:${port}`)
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
      chai.request(`http://localhost:${port}`)
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
      chai.request(`http://localhost:${port}`)
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

  // /////////////////////////////////////////
  //             GET /api/check            //
  // /////////////////////////////////////////
  describe('GET /api/check', () => {
    it('it should GET decoded JWT', (done) => {
      chai.request(`http://localhost:${port}`)
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

