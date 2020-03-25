const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// A secure route, used to send back the user's account number to query
router.get('/profileInfo', (req, res, next) => {
  // Sending back the user details and the token
  res.json({
    message : 'Securely authenticated',
    user : req.user,
    securetoken : req.query.secret_token
  })
});

module.exports = router;
