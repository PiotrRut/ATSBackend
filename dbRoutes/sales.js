require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const User = require('../schemas/User')
const Sale = require('../schemas/Sale')
const {performance} = require('perf_hooks');
const mongoose = require('mongoose')

// Register a new sale, and add it to the seller's record
router.post('/newSale', async (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Advisor') {
      try {
          var result = await Sale.create({
            saleType: req.body.saleType,
            blank: req.body.blank,
            seller: req.body.seller,
            customer: req.body.customer,
            from: req.body.from,
            to: req.body.to,
            GBP_Price: req.body.GBP_Price,
            USD_Price: req.body.USD_Price,
            commission: req.body.commission,
            latePayment: req.body.latePayment,
            paymentType: req.body.paymentType,
            cardNumber: req.body.cardNumber,
            localTax: req.body.localTax,
            otherTaxes: req.body.otherTaxes,
            exchangeRate: req.body.exchangeRate
          })
          const staffID = req.body.seller;
          const response = await User.findByIdAndUpdate(
            staffID,
            {
              $push: { sales: result._id } //result._id has the value of newly created card
            },
            { new: true }
          );
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


module.exports = router;
