require('dotenv').config();
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const flash = require('connect-flash');
const express = require('express');
const User = require('../schemas/User');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


passport.use(new JWTstrategy({
  secretOrKey : process.env.JWT_SECRET,
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

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

// Add user to the database
router.post("/register", (req, res, next) => {
  const { name, surname, role, username, password } = req.body;
  jwt.verify(req.query.secret_token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded.user.role == 'Admin') {
      User.create({ name, surname, role, username, password })
        .then(user => {
          req.login(user, err => {
            if (err) next(err);
            else res.send("User registered");
          });
        }).catch(err => {
          if (err.name === "ValidationError") {
            res.send(err.message)
          } else next(err);
        });
    } else {
      res.status(401).json({ message: 'Unauthorised' })
    }
  })
});

// User login authentication middleware
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if(err || !user){
        const error = new Error('Invalid credentials')
        return next(error);
      }
      req.login(user, async (error) => {
        if( error ) return next(error)
        const body = {
          _id : user._id,
          username : user.username,
          role: user.role,
          name: user.name + " " + user.surname
         };
        const token = jwt.sign(
          { user : body },
          process.env.JWT_SECRET,
        );
        res.cookie('token', token);
        console.log('Employee number ' + req.body.username + ' successfully logged in');
        return res.json({ token: token });
        res.redirect('/')
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});



module.exports = router;
