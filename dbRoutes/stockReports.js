require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const User = require('../schemas/User')
const mongoose = require('mongoose')


// Generating new stock turnover report
router.post('/newStockTnvReport', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) =>{
    if (decoded.user.role == 'Admin') {
      var ranges = await Blank.find({ dateCreated: {$gte: req.body.from, $lt: req.body.to } }, function (err, range) {
          res.send(range)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})










module.exports = router;