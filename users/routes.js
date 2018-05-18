const express = require('express'); const bodyParser = require('body-parser');

const router = express.Router(); const jsonParser = bodyParser.json();

router.post('/login', (req, res) => { res.status(200).json({message:'OK'}) });

router.post('/users/create', (req, res) => {
    let username = req.body.username;
    username = username.trim();
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
            username,
            password: hash,
        }, (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if(item) {
                console.log(`User \`${username}\` created.`);
                return res.json(item);
            }
        });
        });
    });
});

module.exports = {router};
