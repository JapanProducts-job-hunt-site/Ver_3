// Set the enviroment variable to test
process.env.NODE_ENV = 'test';

require('dotenv').config();

const Company = require('../api/models/company');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

chai.use(chaiHttp);

describe('Company', () => {
  //  Remove all the data from test db
  before((done) => {
    Company.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
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
  // /////////////////////////////////////////
  //             GET /company              //
  // /////////////////////////////////////////
  describe('GET /company', () => {
    it('it should say Hello', (done) => {
      chai.request(`http://localhost:${port}`)
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


  // /////////////////////////////////////////
  //      POST /api/company/register       //
  // /////////////////////////////////////////

  describe('POST /api/company/register', () => {
    it('it should return 401 without form data', (done) => {
      chai.request(`http://localhost:${port}`)
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
      chai.request(`http://localhost:${port}`)
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
          Company.count({}, (err, c) => {
            c.should.eql(0);
            done();
          });
        });
    });
    it('it should not POST without password', (done) => {
      const user = {
        name: 'Yuuki',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
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
      const user = {
        password: 'password',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
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
      const user = {
        password: 'password',
        name: 'Yuuki',
      };
      chai.request(`http://localhost:${port}`)
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
      const user = {
        password: 'password',
        name: 'Yuuki',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
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

  // /////////////////////////////////////////
  //    POST /api/company/authenticate     //
  // /////////////////////////////////////////

  describe('POST /api/company/authenticate', () => {
    it('it should not POST with a wrong password', (done) => {
      const company = {
        email: 'yuuki@yuuki.com',
        password: 'passworda',
      };
      chai.request(`http://localhost:${port}`)
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
      const company = {
        password: 'password',
      };
      chai.request(`http://localhost:${port}`)
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
      const company = {
        email: 'Company 1 ',
        password: 'password',
      };
      chai.request(`http://localhost:${port}`)
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
      const company = {
        email: 'aaaa',
      };
      chai.request(`http://localhost:${port}`)
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
      const company = {
        email: 'yuuki@yuuki.com',
        password: 'password',
      };
      chai.request(`http://localhost:${port}`)
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
      const company = {
        password: 'password',
        name: 'Yuuki',
        email: 'yuuki@yuuki.com',
      };
      chai.request(`http://localhost:${port}`)
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
