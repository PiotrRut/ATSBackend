const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schemas/User');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port =  process.env.PORT || 3001
const saltRounds = 10;

// MongoDB connection
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("DB is connected"))
  .catch(error => console.log(error));

// CORS (Cross-Origin-Resource-Shaeing) settings, preventing violations
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())
app.get('/', (req, res) => res.send('API is working correctly!'))

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initialise the passport.js local strategy for user authentication
const local = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);

// Add user to the database and encrypt their password
app.post("/register", (req, res, next) => {
  const { name, surname, role, username, password } = req.body;
  User.create({ name, surname, role, username, password })
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.send("User registered");
      });
    }).catch(err => {
      if (err.name === "ValidationError") {
        res.send(err)
      } else next(err);
    });
});


// Log user in with passport if the account exists
app.post('/login', passport.authenticate('local'),
function(req, res) {
  // Console log the login
  console.log('Employee number ' + req.body.username + ' successfully logged in');
  res.redirect('/')
});


app.listen(port, () => console.log(`Server running on port ${port}`))
