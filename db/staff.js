require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../schemas/User');


// Used to retrieve all users stored in the database
router.get('/getAll', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      User.find({}, function (err, users) {
        res.send(users);
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to delete a user record from the database
router.delete('/deleteUser', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      User.deleteOne({ username: req.body.username }, function (err, users) {
        res.send(req.body.username + ' removed');
    });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// Used to update a user record in the database
router.patch('/updateUser', (req, res, next) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      User.findOne({ username: req.body.oldUsername }, function (err, doc) {
        doc.name = req.body.name;
        doc.surname = req.body.surname;
        doc.role = req.body.role;
        doc.username = req.body.newUsername;
        doc.passwordHash = req.body.password;
        doc.save()
      });
         res.status(200).json({ message: 'User ' + req.body.oldUsername + ' updated successfully' })
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});



module.exports = router;
