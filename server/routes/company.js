const jwt = require('jsonwebtoken');
const Company = require('../../api/models/company'); // get our mongoose model

exports.root = (req, res) => {
  res.send(`Hello! This is API for company http://localhost:${process.env.PORT}/api/company/register to create your company account`);
};

exports.register = (req, res) => {
  // create a sample user
  const newCompany = new Company({
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    admin: false,
  });
  newCompany.save((err) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    } else {
      // if there is no token
      // return an error
      res.json({ success: true });
    }
  });
};

exports.authenticate = (req, res) => {
  if (!req.body.email) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter email.' });
  } else if (!req.body.password) {
    return res.status(401).json({ success: false, message: 'Authentication failed. Enter password.' });
  }

  // find the user
  Company.findOne({
    email: req.body.email,
  }, (err, company) => {
    if (err) {
      res.status(401).send({
        success: false,
        message: err,
      });
    }

    if (!company) {
      res.status(401).json({ success: false, message: 'Authentication failed. Email not found.' });
    } else if (company) {
      // check if password matches
      if (company.password !== req.body.password) {
        res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a toke
        // In the JWT's payload(where all the data stored) send user object
        // when jwt.verify is called we can obtain user data by decoded.user
        const token = jwt.sign({ company }, process.env.secret, {
          expiresIn: 86400, // expires in 24 hours
        });

        res.status(200).json({
          success: true,
          message: 'Enjoy your token for your company!',
          token,
        });
      }
    }
  });
};
