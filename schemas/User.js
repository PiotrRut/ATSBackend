const mongoose = require('mongoose')
const bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema

// Schema for making a new user account (for employees)
const User = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Advisor'],
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

// Generates salts and hash-encrypts the password before writing it to the database
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

User.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

module.exports = mongoose.model('User', User )
