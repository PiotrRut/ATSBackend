const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for the blank model
const Blank = new Schema({
  range: Schema.Types.ObjectID, // <- the range the blank was assigned to upon creation
  assignedTo: {
    type: Schema.Types.ObjectID, // <- the advisor this blank is assigned to, if assigned
    ref: 'User'
  },
  type: Number,
  number: String,
  void: {
        type: Boolean,
        default: false
  },
  dateCreated: { // <- date the blank and range were created
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Blank', Blank )
