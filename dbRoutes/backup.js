require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../schemas/User');
const Blank = require('../schemas/Blank');
const Customer = require('../schemas/Customer');
const CommissionRate = require('../schemas/CommissionRate');
const ExchangeRate = require('../schemas/ExchangeRate');
const TravelAgent = require('../schemas/TravelAgent');
const PaymentCard = require('../schemas/PaymentCard');
const fs = require('fs');

const { spawn, exec } = require('child_process');

// Creating a dump of the database in the dump directory of the server, along with all the db metadata
router.post('/backupdb', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Admin') {
        var backupDB = exec('mongodump --host ' + process.env.MONGO_HOST + ' --ssl --username ' + process.env.MONGO_USNM + ' --password ' + process.env.MONGO_PW + ' --authenticationDatabase admin --db ATS');
            backupDB.stdout.on('data',function(data){
                console.log('stdout: ' + data);
            });
    }
    res.send("Backup successfull")
  })
})

// Restoring the database from latest dump
router.post('/restoredb', (req, res) => {
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded.user.role == 'Admin') {
        var backupDB = exec('mongorestore --host ' + process.env.MONGO_HOST + ' --ssl --username ' + process.env.MONGO_USNM + ' --password ' + process.env.MONGO_PW + ' --authenticationDatabase admin');
            backupDB.stdout.on('data',function(data){
                console.log('stdout: ' + data);
            });
    }
    res.send("Restore successfull")
  })
})




module.exports = router
