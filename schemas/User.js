const mongoose = require('mongoose')
const bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema

// Schema for making a new user account (for employees)
const User = new Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Advisor'],
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  blanks: [{
    type: Schema.Types.ObjectId,
    ref: 'Blank'
  }],
  sales: [{
    type: Schema.Types.ObjectId,
    ref: 'Sale'
  }]
})

// Generates salts and hash-encrypts the password before writing it to the database
User.pre('save', async function(next){
   const hash = await bcrypt.hash(this.password, 10);
   this.password = hash;
   next();
 });

// Used to campare whether a password entered at login matches
// the stored and hashed password in the database
 User.methods.isValidPassword = async function(password){
   const user = this;
   const compare = await bcrypt.compare(password, user.password);
   return compare;
 }


module.exports = mongoose.model('User', User )
