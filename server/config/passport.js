const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/USER');

module.exports = function(passport){
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          if(!user){
            return done(null, false, { message: 'You could not be logged in' });
          }
          return done(null, user)
        })
        .catch(err => console.log(err))
    })
  );

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}