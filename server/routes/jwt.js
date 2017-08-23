const jwt = require('jsonwebtoken');
/*
 * Json web token middle ware
 * Check if JWT is valid
 * if it is invalid return unauthorized
 */
exports.validateJWT = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.params.token || req.headers['x-access-token'];


  // console.log('Token in middle\n' + token)
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.',
        });
      } else if (decoded) {
        console.log('Token is ok')
        // if everything is good, save to request for use in other routes
        console.log('decoded ' + JSON.stringify(decoded))
        req.decoded = decoded;
        console.log('req.decoded ' + JSON.stringify(req.decoded))
        // console.log('decoded ' + req.decoded.user.email);
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(401).send({
      success: false,
      message: 'No token provided.',
    });
  }
};
