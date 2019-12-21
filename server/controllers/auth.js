const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = { // We export so methods can be accessed in our routes
  all: function (req, res) {
    User.find({}, function (err, users) {
      res.json({
        message: "Success",
        users
      })
    });
  },
}
