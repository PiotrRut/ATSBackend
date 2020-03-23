const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Displays information tailored according to the logged in user
router.get('/payment', (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message : 'Securely authenticated',
    user : req.user,
    securetoken : req.query.user_auth
  })
});

module.exports = router;
