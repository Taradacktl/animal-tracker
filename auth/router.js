'use strict';
const nodemailer = require('nodemailer')
const url = require('url');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { User } = require('../users/model');
const config = require('../config');
const crypto = require('crypto')
const router = express.Router();

function fullUrl(req, relativeURL) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: relativeURL
  });
}



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

  try {
    const { emailAddress, resetToken } = req.params

    const user = await User.findOne({ emailAddress })

    if (!user) {
      return res.status(400).send('No such user')
    }

    if (user.resetPasswordToken !== resetToken) {
      return res.status(400).send('Bad token, try again')
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await User.hashPassword(newPassword)
    const updatedUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    res.status(200).send(`
    Hello, ${user.emailAddress}
    Your new password is: ${newPassword}
    `)
  } catch (error) {
    res.status(400).send(`There was an error: <pre>${error.toString()}</pre>`)
  }
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

    const link = fullUrl(req, `/auth/forgotpassword/${emailAddress}/${buf}`)

    const mailInfo = JSON.parse(process.env.MAIL_INFO_JSON)
    let transporter = nodemailer.createTransport(mailInfo.TRANSPORT);

    // NOTE see about sending fake emails for test purposes here https://nodemailer.com/about/
    // NOTE please go here to enable less secure apps
    // https://myaccount.google.com/lesssecureapps
    let mailOptions = {
      from: mailInfo.FROM, // sender address
      to: emailAddress, // list of receivers
      subject: 'Animal tracker: reset password requested', // Subject line
      text: `And here is your link: ${link}`, // plain text body
      // html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'CANNOT_SEND_MAIL', error })
      }
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({ user: user.serialize() })

    });

  } else {
    res.status(404).json({ message: 'USER_NOT_FOUND' })
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
