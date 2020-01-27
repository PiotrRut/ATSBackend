const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
require('dotenv').config()
const app = express()
const port =  process.env.PORT || 5000

const db = mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (req, res) => res.send('API is working correctly!'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
