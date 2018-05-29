const bcrypt = require('bcryptjs');

module.exports = [{
    model: 'User',
    documents: [

        {
            "name": "john332",
            "emailAddress": "john@eample.com",
            "password": bcrypt.hashSync('Deer', 10) //see User model
        },
        {
            "name": "tudorvi",
            "emailAddress": "doe@example.com",
            "password": bcrypt.hashSync('haxxor', 10)
        },
    ]

}]
