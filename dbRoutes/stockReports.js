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
      Blank.find({ $or:
        [
          { dateCreated: {$gte: req.body.from, $lt: req.body.to } },
          { dateAssigned: {$gte: req.body.from, $lt: req.body.to } }
        ]}, (err, results) => {
        res.send(results)
      })
    } else {
      res.status(401).json({ message: 'Unauthorised'})
    }
  })
})




module.exports = router;