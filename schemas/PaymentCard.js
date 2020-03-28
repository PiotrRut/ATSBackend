const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PaymentCard = new Schema({
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
