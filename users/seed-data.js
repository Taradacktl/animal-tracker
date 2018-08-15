const bcrypt = require('bcryptjs');

module.exports = [{
    model: 'User',
    documents: [

        {
            "emailAddress": "john@eample.com",
            "password": bcrypt.hashSync('Deer', 10) //see User model
        },
        {
            "emailAddress": "doe@example.com",
            "password": bcrypt.hashSync('haxxor', 10)
        },
    ]

}]
