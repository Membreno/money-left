const mongoose = require('mongoose');

module.exports = { // We export so methods can be accessed in our routes
  home: (req, res) => {
    res.render('index')
  },
  register: function (req, res) {
    res.render('register')
  },
  login: function (req, res) {
    res.render('login')
  },
}
