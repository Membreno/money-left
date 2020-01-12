const mongoose = require('mongoose');
const User = require('../models/USER');
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passport = require('passport');
const Transaction = mongoose.model('Transaction');
const Bill = mongoose.model('Bill');
const moment = require('moment');

const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
      User.findOne({ email: email})
        .then(user => {
          console.log(user)
          if (user) {
            console.log('user already registered!!!', email)
            // User exits error
            errors.push({ msg: 'Email is already registered'})
            res.render('register',{
              errors,
              name,
              email,
              password,
              password2
            })
          } else {
            // Built in register method available with passport
            User.register(new User({
              username: req.body.email,
              name: req.body.name
            }), req.body.password, function (err, user) {
              if (err) {
                return res.render('register');
              }
              // User is authenticated with passport's local strategy
              passport.authenticate('local')(req, res, function () {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/dashboard');
              })
            }) // REGISTER ENDS
          }
        }) // .then() ENDS
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







  // RESET PASSWORD
  forgot: function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({
          email: req.body.email
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/reset');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 120000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'understandurtech@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'MoneyLeft Project',
          subject: 'MoneyLeft Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) return next(err);
      res.redirect('/reset');
    });
  },

  reset: function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/reset');
          }
          if(req.body.password === req.body.confirm) {
            // Hash Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                // Set password to hashed
                user.password = hash;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                // Save user
                user.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/login');
                  })
                  .catch(err => console.log(err))
              }))
            // user.setPassword(req.body.password, function(err) {
            //   user.resetPasswordToken = undefined;
            //   user.resetPasswordExpires = undefined;
            //   user.save();
            // })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('/reset');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'understandurtech@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'MoneyLeft Project',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success_msg', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/dashboard');
    });
  },













  // TRANSACTION METHODS
  transaction: (req, res) => {
    const {
      amount,
      date,
      impact
    } = req.body;
    // Styling for transactions
    const bank = req.body.impact === 'pos' ?
     updateBank(req.body.bank, amount, 'pos'):
     updateBank(req.body.bank, amount, 'neg');

    function updateBank(bank, adjustment, impact){
      if(impact === 'pos'){
        return (Number(bank) + Number(adjustment))
      }
      return (Number(bank) - Number(adjustment))
    }
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









// forgot password

// router.post('/reset/:token', function(req, res) {
//   async.waterfall([
//     function(done) {
//       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'Password reset token is invalid or has expired.');
//           return res.redirect('back');
//         }
//         if(req.body.password === req.body.confirm) {
//           user.setPassword(req.body.password, function(err) {
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpires = undefined;

//             user.save(function(err) {
//               req.logIn(user, function(err) {
//                 done(err, user);
//               });
//             });
//           })
//         } else {
//             req.flash("error", "Passwords do not match.");
//             return res.redirect('back');
//         }
//       });
//     },
//     function(user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//           user: 'learntocodeinfo@gmail.com',
//           pass: process.env.GMAILPW
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'learntocodeinfo@mail.com',
//         subject: 'Your password has been changed',
//         text: 'Hello,\n\n' +
//           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         req.flash('success', 'Success! Your password has been changed.');
//         done(err);
//       });
//     }
//   ], function(err) {
//     res.redirect('/campgrounds');
//   });
// });