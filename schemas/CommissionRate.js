const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the commission rate model
const CommissionRate = new Schema({
  rate: Number
})

module.exports = mongoose.model('CommissionRate', CommissionRate )
