const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the blank model
const Blank = new Schema({
  range: {
    type: Schema.Types.ObjectID,
    ref: 'BlankRange'
  },
  type: Number,
  number: String,
  void: {
        type: Boolean,
        default: false
  }
})

module.exports = mongoose.model('Blank', Blank )
