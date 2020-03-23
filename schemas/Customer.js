const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = new Schema({
  name: String,
  surname: String,
  alias: String,
  status: {
    type: String,
    enum: ['Regular', 'Valued']
  },
  discount: {
    type: String,
    enum: ['Fixed', 'Flexible']
  }
})

module.exports = mongoose.model('Customer', Customer )
