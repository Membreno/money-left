const express = require('express'),
      expressLayouts = require('express-ejs-layouts'),
      flash = require('connect-flash'),
      session = require('express-session'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      User = require('./server/models/USER'),
      LocalStrategy = require('passport-local').Strategy;

const app = express();

// Requirement For Local Environment
// require('dotenv/config');

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');
// EJS Static
app.use('/', express.static(__dirname + '/static'));
app.use('/reset', express.static(__dirname + '/static'));
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
// Express Session
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
}))
// Connect Flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}...`));