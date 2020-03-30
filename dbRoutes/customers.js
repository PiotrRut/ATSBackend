require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../schemas/Customer');

// Used to add new customers in the system
router.post('/newCustomer', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Advisor') {
      Customer.create({
        name: req.body.name,
        surname: req.body.surname,
        alias: req.body.alias,
        email: req.body.email,
        phoneNo: req.body.phoneNo
      })
      res.send('Registered successfully');
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})


// Used to update customer information
router.patch('/updateCustomer', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Advisor') {
      Customer.findOne({ _id: req.body._id }, function (err, doc) {
        doc.name = req.body.name;
        doc.surname = req.body.surname;
        doc.alias = req.body.alias;
        doc.email = req.body.email,
        doc.phoneNo = req.body.phoneNo
        doc.save()
      });
        res.send('Customer updated successfully')
      // Allow only managers to add customer status and discounts
    } else if (decoded.user.role == 'Manager') {
      Customer.findOne({ _id: req.body._id }, function (err, doc) {
        doc.customerStatus = req.body.customerStatus;
        doc.discount = req.body.discount;
        doc.save()
      });
      res.send('Customer updated successfully')
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to return all customers in the system
router.get('/getAll', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager' || 'Advisor') {
      Customer.find({}, function (err, customers) {
        res.send(customers);
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to delete a user record from the database
router.delete('/deleteCustomer', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager' || 'Advisor' ) {
      Customer.deleteOne({ _id: req.body._id }, function (err, users) {
        res.send(req.body._id + ' removed');
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

module.exports = router;
