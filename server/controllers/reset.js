const User = require('../models/USER'),
      async = require('async'),
      nodemailer = require('nodemailer'),
      crypto = require('crypto');

module.exports = {
  // RESET PASSWORD
  forgot_password: function (req, res, next) {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({
          username: req.body.email
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/reset');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        console.log('RIGHT BEFORE SENDING EMAIL', user)
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'understandurtech@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        console.log('*************', user.email)
        var mailOptions = {
          to: user.username,
          from: 'MoneyLeft Project',
          subject: 'MoneyLeft Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          req.flash('success_msg', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err){
        return next(err);
      }
      res.redirect('/reset');
    });
  },

  reset_password: function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            // Hash Password
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              // user.save();
              user.save(function (err) {
                req.logIn(user, function (err) {
                  done(err, user);
                });
              });
            })
          } else {
            req.flash("error", "Passwords do not match.");
            // return res.redirect('/reset/:token');
            return res.redirect('back');
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
          to: user.username,
          from: 'MoneyLeft Project',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success_msg', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function (err) {
      if (err){
        return next(err);
      }
      res.redirect('/dashboard');
    });
  },
}