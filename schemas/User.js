const mongoose = require('mongoose')
const bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema

const User = new Schema({
  name: String,
  surname: String,
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Consultant']
  },
  username: {
    type: String,
    allowNull: false,
  },
  passwordHash: {
    type: String,
    allowNull: false,
  }
})

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

User.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

module.exports = mongoose.model('User', User )
