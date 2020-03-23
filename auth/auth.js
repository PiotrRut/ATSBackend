const passport = require('passport');
const flash = require('connect-flash');
const express = require('express');
const User = require('../schemas/User');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

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
router.post("/register", (req, res, next) => {
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
router.post('/login', passport.authenticate('local'),
function(req, res) {
  // Console log the login
  console.log('Employee number ' + req.body.username + ' successfully logged in');
  res.redirect('/')
});


module.exports = router;
