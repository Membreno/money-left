const mongoose = require('mongoose');

module.exports = { // We export so methods can be accessed in our routes
  home: function (req, res) {
    res.render('index')
  },
  signup: function (req, res) {
    res.render('signup')
  }
}
