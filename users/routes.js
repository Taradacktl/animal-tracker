const express = require('express'); const bodyParser = require('body-parser');

const router = express.Router(); const jsonParser = bodyParser.json();

router.post('/login', (req, res) => { res.status(200).json({message:'OK'}) });

module.exports = {router};
