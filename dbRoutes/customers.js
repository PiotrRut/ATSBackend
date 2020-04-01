require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../schemas/Customer')
const PaymentCard = require('../schemas/PaymentCard')

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
          if (req.body.name) {
            doc.name = req.body.name
          }
          if (req.body.surname) {
            doc.surname = req.body.surname
          }
          if (req.body.alias) {
            doc.alias = req.body.alias
          }
          if (req.body.email) {
            doc.email = req.body.email
          }
          if (req.body.phoneNo) {
            doc.phoneNo = req.body.phoneNo
          }
          doc.save()
      });
        res.send('Customer updated successfully')
        console.log(res)
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

// Used to return all customers and associated cards in the system
router.get('/getAll', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Manager' || 'Advisor') {
      Customer.find({}, function (err, customers) {
        res.send(customers)
    }).populate({ path: 'cards' }).exec((err, cards) => {
    })
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to delete a user record from the database along with associated payment cards
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

// Add a new payment card and assign it to a specific Customer using their mongoID if desired
router.post('/addPayment', async (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Advisor') {
      try {
        const result = await PaymentCard.create(req.body);
        const customerId = req.body.owner;
        const response = await Customer.findByIdAndUpdate(
          customerId,
          {
            $push: { cards: result._id } //result._id has the value of newly created card
          },
          { new: true }
        );

        res.send(response);
      } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      }
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
})



module.exports = router;
