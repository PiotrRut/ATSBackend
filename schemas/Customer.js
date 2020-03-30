const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PaymentCard = require('../schemas/PaymentCard')

// Schema for the customer model
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
  },
  email: String,
  phoneNo: String,
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'PaymentCard'
  }]
})

module.exports = mongoose.model('Customer', Customer )
