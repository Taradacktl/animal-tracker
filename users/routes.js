const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const { User } = require('./model');

User.create(
    { name: 'John', emailAddress: 'helloEmail', password: 'hello' }
);

router.post('/login', (req, res) => { res.status(200).json({ message: 'OK' }) });
/*
// Post to register a new user
router.post('/create', jsonParser, (req, res) => {
    const requiredFields = ['name', 'emailAddress', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
  
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }
  
    const stringFields = ['name', 'password', 'emailAddress'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );
  
    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      });
    }
});
*/
//user login
router.post('/create', jsonParser, (req, res) => {
    const requiredFields = ['name', 'emailAddress', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
            res.json(item.serialize());
            // res.status(200).json({message:'OK'})
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
/*
//create new user
router.post('/create', (req, res) => {
    let name = req.body.name;
    name = name.trim();
    let emailAddress = req.body.emailAddress;
    emailAddress = emailAddress.trim();
    let password = req.body.password;
    password = password.trim();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        
        User.create({
            name,
            emailAddress,
            password: hash,
        }, (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if(item) {
                console.log(`User \`${name}\` created.`);
                return res.json(item);
            }
        });
        });
    });
});
*/

module.exports = { router };
