const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('User')


module.exports = { // We export so methods can be accessed in our routes
  home: (req, res) => {
    res.render('index')
  },
  register: (req, res) => {
    if(!req.session.user_id){
      res.render('register')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  login: (req, res) => {
    if(!req.session.user_id){
      res.render('login')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  dashboard: (req, res) => {
    req.session.user_id = req.user.id // POSSIBLY NOT NEEDED
    req.session.bill_id = null
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
  },
  settings: (req, res) => {
    User.findOne({_id: req.session.user_id}, function (err, user){
      if(!err){
        let editUser = {
          "name" : user.name,
          "email": user.email
        }
        res.render('settings', editUser)
      }
    })
  },
  forgot: (req, res) => {
    res.render('forgot')
  },
  reset: (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/reset');
      }
      res.render('reset', {token: req.params.token});
    });
  }
}

