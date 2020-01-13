const base = require('../controllers/base.js'); // Used to access the methods within controller
const authorize = require('../controllers/authorize.js');
const finance = require('../controllers/finance.js');
const reset = require('../controllers/reset.js');
const { ensureAuthenticated } = require('./auth');
const passport = require('passport');

module.exports = function (app) {
  // Welcome Page
  app.get('/', (req, res) => base.home(req, res));

  // Register Handles
  app.get('/register', (req, res) => base.register(req, res));
  app.post('/register', (req, res) => authorize.register(req, res));

  // Login Handles
  app.get('/login', (req, res) => base.login(req, res));
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }), function(req, res){});

  // Logout Handle
  app.get('/logout', (req, res) => authorize.logout(req, res));

  // Dashboard
  app.get('/dashboard', ensureAuthenticated, function(req, res){base.dashboard(req, res)});

  // History
  app.get('/history', ensureAuthenticated, (req, res) => finance.history(req, res));

  // Settings
  app.get('/settings', ensureAuthenticated, (req, res) => base.settings(req, res));

  // Transactions
  app.post('/transaction', ensureAuthenticated, (req, res) => finance.transaction(req, res));

  // Update
  app.get('/update', ensureAuthenticated, (req, res) => base.update(req, res));

  // Billing Handles
  app.post('/bill/update', ensureAuthenticated, (req, res) => finance.initiate_update(req, res));
  app.post('/bill/save', ensureAuthenticated, (req, res) => finance.save_update(req, res));
  app.post('/bill/add', ensureAuthenticated, (req, res) => finance.add_bill(req, res));
  app.post('/bill/delete', ensureAuthenticated, (req, res) => finance.delete_bill(req, res));

  // Reset Password
  app.get('/reset', (req, res) => base.forgot(req, res));
  app.post('/reset', (req, res, next) => reset.forgot_password(req, res, next));
  app.get('/reset/:token', (req, res) => base.reset(req, res));
  app.post('/reset/:token', (req, res) => reset.reset_password(req, res));
}