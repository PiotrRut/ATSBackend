const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Customer = require('../schemas/Customer')

const PaymentCard = new Schema({
  owner: {
    type: Schema.Types.ObjectID,
    ref: 'Customer'
  },
  nameOnCard: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 15,
    maxlength: 16
  },
  cardIssuer: String,
  cvc: Number,
  exp: {
    type: Number,
  }
})

module.exports = mongoose.model('PaymentCard', PaymentCard)
