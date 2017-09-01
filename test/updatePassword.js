/*
 * This file is used to set up the test bench
 */

require('dotenv').config();
process.env.NODE_ENV = 'test';

// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

require('dotenv').config();

const User = require('../server/models/user').Model;
const UserMethod = require('../server/models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Require the dev-dependencies

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

chai.use(chaiHttp);


// /////////////////////////////////////////
//             GET /api/update           //
// /////////////////////////////////////////

describe('Update student information', () => {
  const users = [];
  const userJWTs = [];
  const SIZE = 5;
  let saveCount = 0;

  before((done) => {
    User.remove({}, (err) => {
      if (err) console.log(err);
    });

    for (let i = 0; i < SIZE; i++) {
      users.push(
        new User({
          firstName: `First ${i}`,
          lastName: `Last ${i}`,
          password: i,
          email: `user${i}@yuuki.com`,
          admin: false,
        }),
      );
      userJWTs.push(
        jwt.sign({ user: users[i] }, process.env.secret, {
          expiresIn: 86400, // expires in 24 hours
        }),
      );
      // register users
      users[i].save((err, saved) => {
        if (err) {
        }
        console.log(i + ', ' + saved.password)
        saveCount++;
        // Wait all saving is done
        if (saveCount === SIZE) {
          done();
        }
      });
    }
  });

  // Remove all the data from test db
  after((done) => {
    User.remove({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });

  const URI = '/api/users';
  describe(`PUT ${URI}`, () => {
    it('should not be albe to update password via PUT api/users/', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          firstName: 'Updated first 1',
          password: 'updated1@yuuki.com',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('Password cannot be updated via this route');
          done();
        });
    });
    it('should return even password is empty string', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          firstName: 'Updated first 1',
          password: '',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('Password cannot be updated via this route');
          done();
        });
    });
  });
  const updatePassordURI = '/api/updatepassword';
  describe(`PUT ${updatePassordURI}`, () => {
    it('should return 409 if new password is undefined', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          // oldPassword: '',
          // newPassword: '',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('No old password found');
          done();
        });
    });
    it('should return 409 if new password is empty', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          // oldPassword: '',
          newPassword: '',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('No old password found');
          done();
        });
    });
    it('should return 409 if old password is undefined', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          // oldPassword: '',
          // newPassword: '',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('No old password found');
          done();
        });
    });
    it('should return 409 if old password is empty', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          oldPassword: '',
          // newPassword: '',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.success.should.be.false;
          res.body.message.should.be.eql('No old password found');
          done();
        });
    })
    it('should return if the JWT is incorrect', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          oldPassword: '1',
          newPassword: 'new password',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', 'Wrong JWT')
        .send(DATA)
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.body.success.should.be.false;
          res.body.message.should.contain('Failed ');
          done();
        });
    });
    it('should return 409 if the old password is wrong', (done) => {
      done();
    });
    it('should return 200 and PW is hashed', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        user: {
          oldPassword: '1',
          // newPassword: 'new password',
          newPassword: 'a',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(updatePassordURI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eql('Password updated');
          User.findOne({ email: users[USER_INDEX].email }, (errDb, foundUser) => {
            if (errDb) throw errDb;
            console.log(foundUser.password)
            // foundUser.password.should.not.eql(users[USER_INDEX].password);
          done();
          });
        });
    });
  });
  const authURI = '/api/authenticate';
  describe(`POST ${URI}`, () => {
    it('should be able to log in', (done) => {
      const USER_INDEX = 2;
      const user = {
        email: `user${USER_INDEX}@yuuki.com`,
        password: USER_INDEX,
      };
      chai.request(`http://localhost:${port}`)
        .post(authURI)
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
    it('should be able to log in with updated password', (done) => {
      const USER_INDEX = 1;
      const user = {
        email: users[USER_INDEX].email,
        password: 'a',
        // password: USER_INDEX,
      };
      chai.request(`http://localhost:${port}`)
        .post(authURI)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .end((err, res) => {
          User.findOne({ email: users[USER_INDEX].email }, (errDb, foundUser) => {
            if (errDb) throw errDb;
           //  console.log('Pre test' +  foundUser.password)
          });
          console.log(res.body)
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
