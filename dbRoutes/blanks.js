require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')

function numberRange (start, end) {
  return new Array(end - start).fill().map((d, i) => i + start);
}

// Used to add a new rate to the system
router.post('/addBlanks', async (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      var blanks = [];
      for (var i = req.body.from; i <= req.body.to; i++) {
        blanks.push(i);
        Blank.create({
        number: `000000${blanks[blanks.length -1]}`,
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
