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
  secretOrKey : 'secret_top',
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('user_auth')
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
router.post('/register', passport.authenticate('local'), async (req, res, next) => {
  res.json({
    message : 'Thank you, user ' + req.user.username + ' registered',
    user : req.user
  });
});


router.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {     try {
      if(err || !user){
        const error = new Error('Invalid credentials')
        return next(error);
      }
      req.login(user, async (error) => {
        if( error ) return next(error)
        const body = { _id : user._id, username : user.username };
        const token = jwt.sign({ user : body },'secret_top');
        console.log('Employee number ' + req.body.username + ' successfully logged in');
        return res.json({ token: "Bearer " + token });
        res.redirect('/')
      });     } catch (error) {
      return next(error);
    }
  })(req, res, next);
});



module.exports = router;
