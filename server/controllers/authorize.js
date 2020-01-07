const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/USER');
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passport = require('passport');
const Transaction = mongoose.model('Transaction');
const Bill = mongoose.model('Bill');
const moment = require('moment');

module.exports = {
  // USER METHODS
  register: (req, res) => {
    const {
      name,
      email,
      password,
      password2
    } = req.body;
    let errors = []

    // Check required fields
    if (!name || !email || !password || !password2) {
      errors.push({
        msg: 'Please fill in all fields'
      })
    }
    // Check passwords match
    if (password !== password2) {
      errors.push({
        msg: 'Passwords do not match'
      })
    }
    // Check password length
    if (password.length < 6) {
      errors.push({
        msg: 'Password must be at least 6 characters'
      })
    }
    // Check if email matches pattern
    if (!EMAIL_REGEX.test(email)) {
      errors.push({
        msg: "Email must be valid"
      });
    }

    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      })
    } else {
      // Validation Passed
      User.findOne({
          email: email
        })
        .then(user => {
          if (user) {
            // User exits
            errors.push({
              msg: 'Email is already registered'
            })
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            })
          } else {
            const newUser = new User({
              name,
              email,
            });
            // Save user
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/login');
              })
              .catch(err => console.log(err))
          }
        })
    }
  },

  login: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  },

  logout: (req, res) => {
    req.session.user_id = null;
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  },

  // TRANSACTION METHODS
  transaction: (req, res) => {
    const {
      amount,
      date,
      impact
    } = req.body;
    // Styling for transactions
    const bank = req.body.impact === 'pos' ? Number(req.body.bank) + Number(amount) : Number(req.body.bank) - Number(amount);
    // Format transaction name
    let name = req.body.name;
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    // Validation Passed
    const transaction = new Transaction({amount, name, date, impact, bank})
    transaction.save(
      User.findOne({_id: req.session.user_id}, function(err, user){
        user.transactions.push(transaction)
        user.bank = (bank).toFixed(2);
        user.save()
          .then(_ => {
            req.flash('success_msg', 'You completed a transaction')
            res.redirect('/dashboard')
          })
          .catch(err =>{
            console.log(err)
            res.redirect('/dashboard')
          })
      })
    )
  },

  history: function (req, res) {
    User.findOne({_id: req.session.user_id}, function (err, user){
      if(!err){
        let transactions = user.transactions;
        transactions = transactions.sort((a, b) => {
          return (a.createdAt < b.createdAt) ? 1 : -1
        })
        const formatDate = function (timestamp) {
          return moment(timestamp).format('MMMM DD, YYYY');
        }
        res.render('history', { transactions, formatDate })
      }
    })
  },

  // BILLING METHOD
  add_bill: function(req, res){
    // Need to format date before saving for the correct date to show
    const date = moment(req.body.date).format('YYYY/MM/DD')
    const {
      amount,
      repeats
    } = req.body;
    // Format bill name
    let name = req.body.name;
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    // Validation Passed
    const bill = new Bill ({name, amount, date, repeats});
    bill.save(
      User.findOne({_id: req.session.user_id}, function (err, user){
        if(!err){
          user.bills.push(bill)
          user.save()
            .then(_ => {
              req.flash('success_msg', 'You added a new bill')
              res.redirect('/dashboard')
            })
            .catch(err => {
              console.log(err)
              req.flash('error_msg', "Something went wrong. Couldn't add new bill")
              res.redirect('/dashboard')
            })
        }
      })
    )
  },

  // UPDATE METHODS
  initiate_update: function (req, res) {
    req.session.bill_id = req.body.bill_id
    res.redirect('/update')
  },

  update: function(req, res){
    if(!req.session.bill_id){
      res.redirect('/dashboard')
    } else {
      User.findOne({_id: req.session.user_id}, function (err, user){
      if(!err){
        let bills = user.bills
        bills.forEach(bill =>{
          if(bill.id === req.session.bill_id){
            let billInfo = bill
            let billDate = moment(bill.date).format('YYYY-MM-DD')
            let today = moment(new Date()).format('YYYY-MM-DD');
            res.render('update', {bill: billInfo, billDate, today})
          }
        })
      }
    })
    }
  },

  save_update: function (req, res){
    if(!req.session.bill_id){
      res.redirect('/dashboard')
    } else {
      User.findOne({_id: req.session.user_id}, function (err, user){
        if(!err){
          let bills = user.bills
          bills.forEach(bill =>{
            if(bill.id === req.session.bill_id){
              bill.name = req.body.name;
              bill.amount = req.body.amount;
              bill.date = moment(req.body.date).format('YYYY/MM/DD');
            }
          })
        }
        user.save()
        res.redirect('/dashboard')
      })
    }
  },

  // DELETE METHODS
  delete_bill: function (req, res) {
    User.findOne({_id: req.session.user_id}, function (err, user) {
      if (!err) {
        user.bills.pull({_id: req.session.bill_id})
        user.save()
        Bill.deleteOne({_id: req.session.bill_id}, function (err){
          if(!err){
            res.redirect('/dashboard')
          }
        })
      }
    })
  },
}