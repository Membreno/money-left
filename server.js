const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('dotenv/config');


app.use(express.static(__dirname + '/static'));
// app.set('views', __dirname + '/views');

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
}))

// Connect Flash
app.use(flash());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app); // Passing the app as a input for our routes function

const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));