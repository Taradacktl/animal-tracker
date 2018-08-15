'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});


userSchema.methods.serialize = function () {
  return {
    id: this._id,
    emailAddress: this.emailAddress,
  };
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User }; 
