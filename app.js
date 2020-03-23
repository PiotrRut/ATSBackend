const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const User = require('./schemas/User');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port =  process.env.PORT || 3001
const saltRounds = 10;
const auth = require('./auth/auth')

// MongoDB connection
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("DB is connected"))
  .catch(error => console.log(error));

// CORS (Cross-Origin Resource Sharing) config, preventing violations in the future
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())
app.get('/', (req, res) => res.send('API is working correctly!'))

// User authentication middleware route
app.use('/auth', auth);

app.listen(port, () => console.log(`Server running on port ${port}`))
