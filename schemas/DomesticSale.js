const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the customer model
const DomesticSale = new Schema({
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
      ref: 'Customer'
  },
  from: String,
  to: String,
  GBP_price: { // <- local currency fare (if applicable) 
      type: String,
      default: null
  },
  USD_price: { // <- USD fare (if applicable) 
      type: String,
      default: null
  },
  commission: String,
  sold_date: {
      type: Date,
      default: Date.now()
  }
  /// ... couple fields missing
})

module.exports = mongoose.model('DomesticSale', DomesticSale )