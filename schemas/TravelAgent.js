const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TravelAgent= new Schema({
  name: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('TravelAgent', TravelAgent )
