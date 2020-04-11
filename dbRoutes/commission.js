require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CommissionRate = require('../schemas/CommissionRate')


// Used to retrieve all rates stored
router.get('/getAll', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager' || 'Advisor') {
      CommissionRate.find({}, function (err, rates) {
        res.send(rates);
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to delete a particular rate from the system
router.delete('/delete', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager') {
      CommissionRate.deleteOne({ _id: req.body._id }, function (err, rates) {
        res.send(req.body._id + ' removed');
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to add a new rate to the system
router.post('/addRate', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager') {
      CommissionRate.create({
        rate: req.body.rate,
        type: req.body.type
      })
      res.send('Added successfully');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

module.exports = router;
