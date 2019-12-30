const path = require('path');
const base = require('../controllers/base.js'); // Used to access the methods within controller
const authorize = require('../controllers/authorize.js');
const { ensureAuthenticated } = require('./auth');


module.exports = function (app) {
  // Welcome Page
  app.get('/', (req, res) => base.home(req, res));

  // Register Handles
  app.get('/register', (req, res) => base.register(req, res));
  app.post('/register', (req, res) => authorize.register(req, res));

  // Login Handles
  app.get('/login', (req, res) => base.login(req, res));
  app.post('/login', (req, res, next) => authorize.login(req, res, next));

  // Logout Handle
  app.get('/logout', (req, res) => authorize.logout(req, res));

  // Dashboard
  app.get('/dashboard', ensureAuthenticated, (req, res) => base.dashboard(req, res));

  // History
  app.get('/history', ensureAuthenticated, (req, res) => res.render('history'));

  // Settings
  app.get('/settings', ensureAuthenticated, (req, res) => res.render('settings'));

  // Transactions
  app.post('/transaction', ensureAuthenticated, (req, res) => authorize.transaction(req, res));
}