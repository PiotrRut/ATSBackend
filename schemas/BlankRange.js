const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the blank range model
const BlankRange = new Schema({
  type: Number,
  from: String,
  to: String,
  added: {
    type: Date, default: Date.now
  },
  blanks: [{
    type: Schema.Types.ObjectId,
    ref: 'Blank'
  }]
})

module.exports = mongoose.model('BlankRange', BlankRange )
