/*
 * This file is used to set up the test bench
 */
process.env.NODE_ENV = 'test';

require('dotenv').config();

// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
