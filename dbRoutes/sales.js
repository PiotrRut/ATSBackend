require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blank = require('../schemas/Blank')
const User = require('../schemas/User')
const Sale = require('../schemas/Sale')
const Customer = require('../schemas/Customer')
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
            localTax: req.body.localTax,
            otherTaxes: req.body.otherTaxes,
            commission: req.body.commission,
            latePayment: req.body.latePayment,
            paymentType: req.body.paymentType,
            cardNumber: req.body.cardNumber,
            issuer: req.body.issuer,
            exchangeRate: req.body.exchangeRate,
            sold_date: req.body.sold_date,
            totalAmount: req.body.totalAmount
          })
          const staffID = req.body.seller;
          const blankID  = req.body.blank
          // register sale to the advisor
          const salereg = await User.findByIdAndUpdate(
            staffID,
            {
              $push: { sales: result._id } //result._id has the value of newly created sale
            },
            { new: true }
          );
          // register purchase to the customer
          const saleregCust = await Customer.findByIdAndUpdate(
            req.body.customer,
            {
              $push: { purchases: result._id } //result._id has the value of newly created sale
            },
            { new: true }
          );
          // mark blank used as sold
          const blankSold = await Blank.findOne({ _id: blankID}, function (err, doc) {
            doc.sold = true;
            doc.save();
          });
      }
      catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
      }
      res.send('Added successfully');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})

// Get the list of all sales
router.get('/getAll', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin' || 'Manager' || 'Advisor') {
      Sale.find({}, function (err, sales) {
        res.send(sales);
    }).populate({ path: 'customer'})
      .populate({ path: 'seller'})
      .populate({ pat: 'blank'})
      .exec((err, blanks, sales) => {
      })
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});


module.exports = router;
