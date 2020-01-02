const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('User')


module.exports = { // We export so methods can be accessed in our routes
  home: (req, res) => {
    res.render('index')
  },
  register: function (req, res) {
    if(!req.session.user_id){
      res.render('register')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  login: function (req, res) {
    if(!req.session.user_id){
      res.render('login')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  dashboard: function (req, res) {
    req.session.user_id = req.user.id // POSSIBLY NOT NEEDED
    let today = moment(new Date()).format('YYYY-MM-DD');
    const formatDate = function (timestamp) {
      return moment(timestamp).format('Do');
    }
    User.findOne({_id: req.session.user_id}, function (err, user){
      var bills = user.bills;
      bills = bills.sort((a, b) => {
        return (a.date > b.date) ? 1 : -1
      })
      res.render('dashboard', {
        name: req.user.name,
        bank: req.user.bank,
        today,
        bills,
        formatDate
      })
    })
  }
}
