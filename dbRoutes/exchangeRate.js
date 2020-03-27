require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ExchangeRate = require('../schemas/ExchangeRate');


// Used to update the local currenct exchange rate, or create a record if there is none
router.post('/updateExchangeRate', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      var query = {},
          update = {
            localCurrencyCode: req.body.localCurrencyCode,
            rate: req.body.rate
          },
          options = { upsert: true, new: true, setDefaultsOnInsert: true };
      ExchangeRate.findOneAndUpdate(query, update, options, function(err, res){
        if (err) {
          return err;
          console.log(err)
        } else {
          update;
        }
      })
      res.send('Updated successfully');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to retrieve the current exchange rate
router.get('/getExchangeRate', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      ExchangeRate.find({}, function (err, details) {
        res.send(details);
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});




module.exports = router;
