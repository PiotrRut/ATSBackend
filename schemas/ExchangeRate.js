const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Yet to be completed
const ExchangeRate = new Schema({
  localCurrencyCode: {
    type: String,
    required: true
  },
  // enforce XXXXX.YYYY format on exchange rates
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
