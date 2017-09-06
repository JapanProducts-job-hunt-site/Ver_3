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
const fs = require('fs');

// Require the dev-dependencies

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens

chai.use(chaiHttp);


// /////////////////////////////////////////
//             PUT /api/updateimg         //
// /////////////////////////////////////////

describe('Update student password', () => {
  const Base64Images = [];
  const users = [];
  const userJWTs = [];
  const SIZE = 5;
  let saveCount = 0;

  before((done) => {
    User.remove({}, (err) => {
      if (err) console.log(err);
    });

    console.log(process.cwd());

    /**
     * Read img and convert to Base64
     */
    // fs.readFile(`${__dirname}/img/profile1.jpg`, function(err, original_data){
    //   fs.writeFile('image_orig.jpg', original_data, function(err) {});
    //   var base64Image = original_data.toString('base64');
    //   var decodedImage = new Buffer(base64Image, 'base64');
    //   fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
    // });

    const fileNames = ['profile1.jpg', 'profile2.png', 'profile3.png', 'profile4.jpg'];
    fileNames.forEach((fileName) => {
      fs.readFile(`${__dirname}/img/${fileName}`, (err, originalData) => {
        if (err) throw err;
        const base64Image = originalData.toString('base64');
        Base64Images.push(base64Image);
      });
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
          if (err) console.err(err);
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
    it('should return 401 if no img object', (done) => {
      const USER_INDEX = 1;
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.eql('No data');
          done();
        });
    });
    it('should return 401 if no img data', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        img: {
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.eql('No image to upload');
          done();
        });
    });
    it('should return 401 if no delete boolean flag', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        img: {
          data: 'test',
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.eql('No delete boolean flag');
          done();
        });
    });
    it('should return 201 with correct data', (done) => {
      const USER_INDEX = 1;
      const DATA = {
        img: {
          data: Base64Images[1],
          delete: false,
        },
      };
      chai.request(`http://localhost:${port}`)
        .put(URI)
        .set('Content-Type', 'application/json')
        .set('x-access-token', userJWTs[USER_INDEX])
        .send(DATA)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          // res.body.message.should.be.eql('No delete boolean flag');
          done();
        });
    });
  });
});
