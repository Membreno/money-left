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
    const formatDateDay = function (timestamp) {
      return moment(timestamp).format('Do');
    }
    const formatDate = function (timestamp) {
      return moment(timestamp).format('MMMM DD, YYYY');
    }
    User.findOne({_id: req.session.user_id}, function (err, user){
      let bills = user.bills;
      bills = bills.sort((a, b) => {
        return (a.date.getDate() > b.date.getDate()) ? 1 : -1
      })
      res.render('dashboard', {
        name: req.user.name,
        bank: user.bank,
        today,
        bills,
        formatDate,
        formatDateDay,
        transactions: user.transactions
      })
    })
  }
}
