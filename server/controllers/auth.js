const mongoose = require('mongoose');
// const User = mongoose.model('User');

module.exports = { // We export so methods can be accessed in our routes
  home: function (req, res) {
    res.render('index')
  },
}
