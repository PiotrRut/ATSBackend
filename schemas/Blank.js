const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the commission rate model
const Blank = new Schema({
  type: Number,
  number: String,
  void: {
        type: Boolean,
        default: false
  }
})

module.exports = mongoose.model('Blank', Blank )
