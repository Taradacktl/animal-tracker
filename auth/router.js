'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { User } = require('../users/model');
const config = require('../config');
const router = express.Router();

const createAuthToken = function (user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.emailAddress,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false, failWithError: false });
router.use(bodyParser.json());
// The user provides an emailAddress and password to login
router.post('/login', localAuth, (req, res) => {
  console.log('LOGIN ATTEMPT SUCCESFUL', req.emailAddress, req.password, req.user)
  //on a succesful login  localAuth will do req.user = <the mongoose db record fo the user>
  const authToken = createAuthToken(req.user.serialize());
  const emailAddress = req.user.serialize().emailAddress;
  res.json({ authToken, emailAddress });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/changepassword', jwtAuth, async (req, res) => {

  try {
    const requiredFields = ['newPassword', 'retypeNewPassword'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }

    const hashedPassword = await User.hashPassword(req.body.newPassword)
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { password: hashedPassword })    
    res.status(200).json({})
    
  } catch (e) {
    console.error('changepassword ERROR')
    console.error(e)
    res.status(500).json({ error: e.toString() })
  }
});


// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh-auth-token', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });

});

module.exports = { router };
