'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { User } = require('../users/model');
const config = require('../config');
const crypto = require('crypto')
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


router.get('/forgotpassword/:emailAddress/:resetToken', async (req, res) => {
  // TODO check the reset token

  const emailAddress = req.params.emailAddress

  const user = await User.find({ emailAddress })

  // TODO check 

  //return a JWT

})

router.post('/forgotpassword', async (req, res) => {
  var buf = crypto.randomBytes(16).toString('hex');
  console.log('Random token of %d bytes in hexadecimal: %s', buf.length, buf);

  const emailAddress = req.body.emailAddress

  const user = await User.findOneAndUpdate({ emailAddress }, {
    resetPasswordToken: buf,
    resetPasswordExpires: Date.now() + 3600000,
  })

  if (user) {
    res.status(200).json({ user: user.serialize() })
    //TODO send e-mail
  } else {
    res.status(401).json({})
    //no such user
  }


})


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

    const userRecord = await User.findById(req.user.id)

    const validPassword = await userRecord.validatePassword(req.body.currentPassword)

    if (!validPassword) {
      return res.status(400).send({ message: 'Current password is wrong' });
    }

    if (req.body.newPassword.length < 4) {
      return res.status(400).send({ message: 'Password is too short' });
    }

    if (req.body.newPassword !== req.body.retypeNewPassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
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
