require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const {performance} = require('perf_hooks');
const mongoose = require('mongoose')

/*
* Used to add a new range of blanks to the system.
* `to` and `from` define the upper and lower bounds of the range.
* Individual blank records are then created withing that range,
* each with unique ID's and void status (defaulted to false)
*/
router.post('/addBlanks', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      try {
        var blanks = [];
        const range = mongoose.Types.ObjectId()
        for (var i = req.body.from; i <= req.body.to; i++) {
          blanks.push(i);
          var result = Blank.insertMany({
            range: range,
            type: req.body.type,
            number: `000000${blanks[blanks.length -1]}`,
            void: req.body.void
          })
        }
        res.send('Added successfully');
        Blank.create({
          _id: range,
          type: req.body.type,
          from: `000000${req.body.from}`,
          to: `000000${req.body.to}`
        })
      }
      catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
      }
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

// Used to get ALL of the blanks currently stored, regardless of their range
router.get('/getAll', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) =>{
    if (decoded.user.role == 'Admin' || 'Manager') {
      var allBlanks = Blank.find({ range: !null }, function(err, blanks) {
        res.send(blanks)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})

// Returns all blanks within a range, given the range ID associated included in body
router.get('/getRangeContents', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) =>{
    if (decoded.user.role == 'Admin' || 'Manager') {
      var ranges = Blank.find({ range: req.body.range }, function(err, range) {
        res.send(range)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})

// Returns all blanks within a range, given the range ID associated included in body
router.get('/getRange', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) =>{
    if (decoded.user.role == 'Admin' | 'Manager') {
      var ranges = await Blank.find({ from: {$gte: 0 } }, function(err, range) {
          res.send(range)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})

// Assigning blanks
router.post('/assignBlanks', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Manager') {
      try {
        const staffID = req.body.assignedTo;
        const result = await Blank.find({_id: _id })
        const response = await User.findByIdAndUpdate(
          staffID,
          {
            $push: { blanks: result._id } //result._id has the value of newly created card
          },
          { new: true }
        );
        res.send(response);
      } catch (err) {
        console.log(err);
        res.status(500).send("Could not add");
      }
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

// Used to delete a user record from the database along with associated payment cards
router.delete('/deleteRange', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      Blank.deleteOne({ _id: req.body._id}, function (err, users) {
      });
      Blank.deleteMany({ range: req.body._id}, function (err, users) {
      });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

module.exports = router;
