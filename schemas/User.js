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
  password: {
    type: String,
    required: true
  }
})

// Generates salts and hash-encrypts the password before writing it to the database
User.pre('save', async function(next){
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

User.methods.isValidPassword = async function(password){
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

module.exports = mongoose.model('User', User )
