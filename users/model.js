'use strict';

const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);

module.exports = { User }; 