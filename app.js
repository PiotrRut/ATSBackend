require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const User = require('./schemas/User');
const bodyParser = require('body-parser');
const app = express();
const port =  process.env.PORT || 3001
const saltRounds = 10;
const auth = require('./auth/auth')
const staff = require('./dbRoutes/staff');
const travelAgent = require('./dbRoutes/travelagent')
const securedRoute = require('./router/secure-route')
const exchangeRate = require('./dbRoutes/exchangeRate')
const customers = require('./dbRoutes/customers')
const commissionRate = require('./dbRoutes/commission')

// MongoDB connection
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(()=> console.log("DB is connected"))
  .catch(error => console.log(error));
  mongoose.set('useCreateIndex', true);

// CORS (Cross-Origin Resource Sharing) config, preventing violations in the future
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization')
  res.header("Access-Control-Allow-Methods", '*')
  next()
})

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session())
app.get('/', (req, res) => res.send('API is working correctly!'))

// DB routes
app.use('/auth', auth) // Authenticating users
app.use('/staff', staff) // Maintaining staff
app.use('/agency', travelAgent) // Maintaining travel agent details
app.use('/sales', exchangeRate) // Maintaining the local currency exchange rate
app.use('/customers', customers) // Maintaining the customers
app.use('/commissions', commissionRate) // Maintaining the commission rates


// Secure route, following the /auth endpoint only for logged in users (all roles)
// Returns the token and information about currently logged in user
app.use('/auth', passport.authenticate('jwt', { session : false }), securedRoute );


app.listen(port, () => console.log(`Server running on port ${port}`))
