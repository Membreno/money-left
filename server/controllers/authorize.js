const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const User = mongoose.model('User');
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passport = require('passport');

module.exports = { // We export so methods can be accessed in our routes
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
              password
            });

            // Hash Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                // Set password to hashed
                newUser.password = hash;
                // Save user
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/login');
                  })
                  .catch(err => console.log(err))
              }))
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
  }

}