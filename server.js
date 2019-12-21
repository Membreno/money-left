const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const app = express();// Passing the app as a input for our routes function

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));