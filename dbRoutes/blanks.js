require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const User = require('../schemas/User')
const {performance} = require('perf_hooks');
const mongoose = require('mongoose')

/*
* Used to add a new range of blanks to the system.
* `to` and `from` define the upper and lower bounds of the range.
* Individual blank records are then created withing that range,
* each with unique ID's and void status (defaulted to false)
*/
router.post('/addBlanks', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
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
      var allBlanks = Blank.find({ range: {$ne: null} }, function(err, blanks) {
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

// Returns all range entries
router.get('/getRange', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) =>{
    if (decoded.user.role == 'Admin' || 'Manager') {
      var ranges = await Blank.find({ from: {$gte: 0 } }, function(err, range) {
          res.send(range)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})

/*
* Used to add a new range of blanks to the system.
* "req type" is the type of blanks being assigned.
* "req to" and "req from" is the subset of blanks being assigned, for example
*     from: 1, to: 5, will assign blanks 0000001 - 0000005.
* "req assignedTo" is the ID of the advisor to whom we are assigning blanks.
*/
router.post('/assignBlanks', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Manager') {
      try {
        for (var i = req.body.from; i <= req.body.to; i++) {
          console.log(i)
          const result = await Blank.findOne({ type: req.body.type, number: `000000${i}`}, function (err, doc) {
            doc.assignedTo = req.body.assignedTo;
            doc.dateAssigned = Date.now();
            doc.save();
          });
          const staffID = req.body.assignedTo; // const to query the users collection
          const response = await User.findByIdAndUpdate(
            staffID,
            {
              $push: { blanks: result._id } //result._id holds the _id of the blank being assigned
            },
            { new: true }
          );
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Could not add");
      }
      res.send('Done');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

// Used to delete a range and all of the associated blanks within that range
router.delete('/deleteRange', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      Blank.deleteOne({ _id: req.body._id}, function (err, users) {
      });
      Blank.deleteMany({ range: req.body._id}, function (err, users) {
      });
      res.send('Done')
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

module.exports = router;
