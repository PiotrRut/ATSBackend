require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const {performance} = require('perf_hooks');

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
        for (var i = req.body.from; i <= req.body.to; i++) {
          blanks.push(i);
          var result = Blank.create({
            type: req.body.type,
            number: `000000${blanks[blanks.length -1]}`,
            void: req.body.void
          })
          console.log(blanks[blanks.length -1])
        }
        res.send('Added successfully');
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

router.get('/getAll', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) =>{
    if (decoded.user.role == 'Admin') {
      BlankRange.find({}, function(err, blanks) {
        res.send(blanks)
      }).populate({ path: 'blanks' }).exec((err, blanks) => {
        })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})

module.exports = router;
