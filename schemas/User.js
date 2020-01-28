const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User = new Schema({
  name: String,
  surname: String,
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Consultant']
  },
})

module.exports = mongoose.model('User', User )
