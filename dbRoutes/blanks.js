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

router.post('/addBlanks', async (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      var blanks = [];
      for (var i = req.body.from; i <= req.body.to; i++) {
        blanks.push(i);
        Blank.insertMany({
          type: req.body.type,
          number: `000000${blanks[blanks.length -1]}`,
          void: req.body.void
        })
        console.log(blanks[blanks.length -1])
      }
      res.send('Added successfully');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

module.exports = router;
