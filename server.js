const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const app = express();
require('dotenv/config');


app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxage: 60000
  }
}))
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app); // Passing the app as a input for our routes function

const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));