const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  alias: String,
  customerStatus: {
    type: String,
    enum: ['Regular', 'Valued'],
  },
  discount: {
    type: String,
    enum: ['Fixed', 'Flexible']
  }
})

module.exports = mongoose.model('Customer', Customer )
