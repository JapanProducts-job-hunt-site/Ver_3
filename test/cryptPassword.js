//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

require('dotenv').config();

const User = require('../server/models/user');
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

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
  const URI = '/api/register';

  describe(`POST ${URI}`, () => {
    it('password has to be crypted', (done) => {
      const user = {
        firstName: 'Yuuki',
        lastName: 'Kuroshima',
        password: 'password',
        email: '1yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
        .post(URI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').that.to.be.true;
          User.Model.findOne({ email: user.email }, (errDb, foundUser) => {
            if (errDb) throw errDb;
            console.log(foundUser.password)
            foundUser.password.should.not.eql(user.password);
            done();
          });
        });
    });
  });
  describe(`POST ${URI}`, () => {
    it('Should post if password is correct', (done) => {
      done();
    });
  });
  describe(`POST ${URI}`, () => {
    it('Should not post if password is wrong', (done) => {
      done();
    });
  });
  describe(`POST ${URI}`, () => {
    it('password has to be crypted after update', (done) => {
      done();
    });
  });
  describe(`POST ${URI}`, () => {
    it('Same testing for company', (done) => {
      done();
    });
  });
});
