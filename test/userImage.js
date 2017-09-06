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
//             PUT /api/updateimg         //
// /////////////////////////////////////////

describe('Update student password', () => {
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

  /**
   * Expected JSON
   * img: {
   *   data: Base64,
   *   contentType: string,
   *   delete: boolean,
   * }
   */

  const URI = '/api/uploadimg';
  describe(`PUT ${URI}`, () => {
    it('should return 401 if no img data', (done) => {
      const USER_INDEX = 1;
      // const DATA = {
      //   img: {
      //     password: 'updated1@yuuki.com',
      //   },
      // };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
