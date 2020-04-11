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
    default: 'Regular'
  },
  discount: {
    type: String,
    default: null
  },
  fixedDiscount: String,
  flexibleU1000: String,
  flexibleO1000: String,
  flexibleO2000: String,
  email: String,
  phoneNo: String,
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'PaymentCard'
  }],
  purchases: [{
    type: Schema.Types.ObjectId,
    ref: 'Sale'
  }]
})

module.exports = mongoose.model('Customer', Customer )
