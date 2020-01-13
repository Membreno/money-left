const mongoose = require('mongoose'),
      User = require('../models/USER'),
      passport = require('passport'),
      EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
         username: email
        })
        .then(user => {
          console.log("Checking if user registered ", user)
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
            console.log('IN FINAL ELSE FOR REGISTRATION')
            // Built in register method available with passport
            User.register(new User({
              username: req.body.email,
              name: req.body.name
            }), req.body.password, function (err, user) {
              if (err) {
                console.log('THERES AN ERROR', err)
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
}