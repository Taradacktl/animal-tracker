const bcrypt = require('bcryptjs');

module.exports = [{
    model: 'User',
    documents: [

        {
            "name": "John O'Malley",
            "emailAddress": "john@eample.com",
            "password": bcrypt.hashSync('Deer', 10) //see User model
        },
        {
            "name": "Tudor von Ilisoi",
            "emailAddress": "doe@example.com",
            "password": bcrypt.hashSync('haxxor', 10)
        },
    ]

}]
