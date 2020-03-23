const express = require('express');
const router = express.Router();

//Let's say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/payment', (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message : 'Securely authenticated',
    user : req.user,
    seuretoken : req.query.user_auth
  })
});

module.exports = router;
