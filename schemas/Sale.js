const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for a new sale model
const Sale = new Schema({
  saleType: String,
  blank: { // <- the blank used to make the sale
      type: Schema.Types.ObjectID,
      ref: 'Blank'
  },
  seller: {
      type: Schema.Types.ObjectID,
      ref: 'User'
  },
  customer: {
      type: Schema.Types.ObjectID,
      ref: 'Customer',
  },
  from: String,
  to: String,
  GBP_Price: { // <- local currency fare (if applicable)
      type: String,
      default: null
  },
  USD_Price: { // <- USD fare (if applicable)
      type: String,
      default: null
  },
  commission: String,
  sold_date: {
      type: Date,
      default: Date.now() // TODO: change this, should be able to pick date
  },
  latePayment: {
    type: Boolean,
    default: false
  },
  paymentType: String,
  cardNumber: {
    type: String,
    default: null
  },
  issuer: {
    type: String,
    default: null
  },
  localTax: String,
  otherTaxes: {
    type: String,
    default: null
  },
  exchangeRate: {
    type: String,
  },
  totalAmount: Number
})

module.exports = mongoose.model('Sale', Sale )
