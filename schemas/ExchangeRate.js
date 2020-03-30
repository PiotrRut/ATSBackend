const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the exchange rate model
const ExchangeRate = new Schema({
  localCurrencyCode: {
    type: String,
    required: true
  },
  rate: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
          return /^[0-9]{5}\.[0-9]{4}$/.test(v);
      }
    }
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('ExchangeRate', ExchangeRate )
