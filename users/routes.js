const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const jsonParser = bodyParser.json();
const { User } = require('./model');

//create new user
router.post('/create', jsonParser, (req, res) => {
    const requiredFields = ['emailAddress', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //validation went well, now create the Mongo record

    const userPromise =
        User.hashPassword(req.body.password).then(hashedPassword =>
            User.create({
                emailAddress: req.body.emailAddress,
                password: hashedPassword,
                
            }));

    userPromise
        .then(user => { res.status(200).json(user.serialize()) })
        .catch(err => {
            console.log('MONGO ERRORR', err.toString())
            res.status(500).json({ message: 'CANNOT_CREATE_USER', reason: err.toString() })
        })

});

router.get('/create', (req, res) => {
    res.json(User.get());
})

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/profile',  jwtAuth, (req, res) => {
console.log('AUTH USER IS:', req.user) 
   const userPromise = User.findOne({emailAddress:req.user.emailAddress})
   
   userPromise.then(user=>{
       res.json(user.serialize())
   })
   userPromise.catch(err=>{
       res.status(404).json({message:'NOT_FOUND'})
   })
})


module.exports = { router };
