'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.emailAddress,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false, failWithError: false});
router.use(bodyParser.json());
// The user provides an emailAddress and password to login
router.post('/login', localAuth, (req, res) => {
  console.log('LOGIN ATTEMPT SUCCESFUL', req.emailAddress, req.password, req.user )
  //on a succesful login  localAuth will do req.user = <the mongoose db record fo the user>
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh-auth-token', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
 
});

module.exports = {router};
