'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
});


userSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    emailAddress: this.emailAddress,
  };
};

userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isValid) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User }; 
