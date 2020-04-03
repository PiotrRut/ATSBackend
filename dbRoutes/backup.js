require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../schemas/User');
const fs = require('fs');
const CommissionRate = require('../schemas/CommissionRate')

const { exec } = require("child_process");

router.post('/backup', (req, res) => {
    User.find({}, (err, docs) => {
      if (err)
        return res.sendStatus(500)
      fs.writeFileSync('output.json', JSON.stringify(docs, null, 2), {flag: 'a'}, function(){ return res.json(docs) })
    })
    CommissionRate.find({}, (err, docs) => {
      if (err)
        return res.sendStatus(500)
      fs.writeFileSync('output.json', JSON.stringify(docs, null, 2), {flag: 'a'}, function(){ return res.json(docs) })
    })
})

module.exports = router
