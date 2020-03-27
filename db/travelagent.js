require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const TravelAgent = require('../schemas/TravelAgent');


// Used to retrieve all users stored in the database
router.post('/updateAgentDetails', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      var query = {},
          update = {
            name: req.body.name,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            postcode: req.body.postcode
          },
          options = { upsert: true, new: true, setDefaultsOnInsert: true };
      TravelAgent.findOneAndUpdate(query, update, options, function(err, res){
        if (err) {
          return;
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

router.get('/getAgentDetails', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      User.find({}, function (err, details) {
        res.send(details);
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});




module.exports = router;
