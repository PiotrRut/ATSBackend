const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./schemas/User');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port =  process.env.PORT || 3001

// MongoDB connection
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("DB is connected"))
  .catch(error => console.log(error));

app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => res.send('API is working correctly!'))

// Add user to the database
app.post('/addUser', (req, res) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname
  }).save((err, response)=>{
    if(err) res.status(400).send(err)
    res.status(200).send(response)
    })
  })


app.listen(port, () => console.log(`Server running on port ${port}`))
