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

    const userPromise =
        User.hashPassword(req.body.password).then(hashedPassword =>
            User.create({
                password: hashedPassword,
                name: req.body.name,
                emailAddress: req.body.emailAddress
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

module.exports = { router };
