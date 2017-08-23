/**
 * Set up for testing
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

require('dotenv').config();
// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

const User = require('../server/models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

const RegisterURI = '/api/register';
const AuthenticateURI = '/api/authenticate';
const UserURI = '/api/users';

describe('Crypt password', () => {
  // Remove all the data from test db
  before((done) => {
    User.Model.remove({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });
  // Remove all the data from test db
  after((done) => {
    User.Model.remove({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });

  // /////////////////////////////////////////
  //          POST /api/register            //
  // /////////////////////////////////////////

  describe(`POST ${RegisterURI}`, () => {
    it('password has to be crypted', (done) => {
      const user = {
        firstName: 'Yuuki',
        lastName: 'Kuroshima',
        password: 'password',
        email: '1yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
        .post(RegisterURI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').that.to.be.true;
          User.Model.findOne({ email: user.email }, (errDb, foundUser) => {
            if (errDb) throw errDb;
            // console.log(foundUser.password)
            foundUser.password.should.not.eql(user.password);
            done();
          });
        });
    });
  });
  let JWT = '';
  describe(`POST ${AuthenticateURI}`, () => {
    it('should post with corret pair of email and passowrd', (done) => {
      const user = {
        password: 'password',
        email: '1yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
        .post(AuthenticateURI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').that.to.be.true;
          res.body.should.have.property('token');
          // console.log('token ' + res.body.token)
          JWT = res.body.token;
          done();
        });
    });
    it('should not post with incorret passowrd', (done) => {
      const user = {
        password: 'incrrectpassword',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
        .post(AuthenticateURI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('success').that.to.be.false;
          done();
        });
    });
    it('should not post with incorret pair of email and passowrd', (done) => {
      const user = {
        password: 'password',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
        .post(AuthenticateURI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('success').that.to.be.false;
          done();
        });
    });
  });
  describe(`PUT ${UserURI}`, () => {
    it('should update and password should be crypted', (done) => {
      const DATA = {
        user: {
          firstName: 'Updated',
          password: 'updatedpassword',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(UserURI)
        .set('content-type', 'application/json')
        .set('x-access-token', JWT)
        .send(DATA)
        .end((err, res) => {
          console.log(res.body)
          // console.log('JWT' + JWT)
          res.should.have.status(200);
          res.body.should.be.a('object');
          User.Model.findOne({ email: '1yuuki@yuuki.com' }, (errDb, foundUser) => {
            if (errDb) throw errDb;
            console.log(foundUser.password)
            foundUser.password.should.not.eql(DATA.user.password);
            done();
          });
        });
    });
  });
  describe(`POST ${RegisterURI}`, () => {
    it('Should not post if password is wrong', (done) => {
      done();
    });
  });
  describe(`POST ${RegisterURI}`, () => {
    it('password has to be crypted after update', (done) => {
      done();
    });
  });
  describe(`POST ${RegisterURI}`, () => {
    it('Same testing for company', (done) => {
      done();
    });
  });
});
