const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const jsonParser = bodyParser.json();
const { User } = require('./model');
//const { router: authRouter, localStrategy, jwtStrategy } = require('./strategies');
//passport.use(localStrategy);
//passport.use(jwtStrategy)

// User.create(
//     { name: 'John', emailAddress: 'helloEmail', password: 'hello' }
// );
/*
//router.post('/login', (req, res) => { res.status(200).json({ message: 'OK' }) });

//login user
const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
      subject: user.name,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  };
  
  const localAuth = passport.authenticate('local', {session: false});
  router.use(bodyParser.json());
  // The user provides a emailAddress and password to login
  router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
  });
  
  const jwtAuth = passport.authenticate('jwt', {session: false});
  
  // The user exchanges a valid JWT for a new one with a later expiration
  router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  });
  
*/

//create new user
router.post('/create', jsonParser, (req, res) => {
    const requiredFields = ['name', 'emailAddress', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //validation went well, now create the Mongo record
    const userPromise = User.create({
        password: req.body.password, 
        name: req.body.name, 
        emailAddress: req.body.emailAddress
    });

    userPromise
        .then(user => { res.status(200).json(user.serialize()) })
        .catch(err => { 
            console.log('MONGO ERRORR', err.toString())
            res.status(500).json({ message: 'CANNOT_CREATE_USER', reason:err.toString() }) 
        })
    
});

router.get('/create', (req, res) => {
    res.json(User.get());
})

module.exports = { router };
