const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('dotenv/config');

// Passport config
require('./server/config/passport')(passport);

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

// EJS Static
app.use(express.static(__dirname + '/static'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// Routes & Mongoose config
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app); // Passing the app as a input for our routes function

const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));