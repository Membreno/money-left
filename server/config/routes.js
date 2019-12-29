const path = require('path');
const base = require('../controllers/base.js'); // Used to access the methods within controller
const authorize = require('../controllers/authorize.js');
const { ensureAuthenticated } = require('./auth');


module.exports = function (app) { // By declaring as a function we can access each route individually
  // Welcome Page
  app.get('/', function (req, res) {
    base.home(req, res);
  });
  // Register Handles
  app.get('/register', function (req, res) {
    base.register(req, res);
  });
  app.post('/register', function (req, res) {
    authorize.register(req, res);
  });
  // Login Handles
  app.get('/login', function (req, res) {
    base.login(req, res);
  });
  app.post('/login', function (req, res, next) {
    authorize.login(req, res, next);
  });
  // Dashboard
  app.get('/dashboard', ensureAuthenticated, function (req, res){
    base.dashboard(req, res);
  });
  // Logout Handle
  app.get('/logout', (req, res) => authorize.logout(req, res));
}



// Routes
// app.get('/ml/dashboard', (req, res) => {
//   res.render('dashboard')
// })
// app.get('/ml/history', (req, res) => {
//   res.render('history')
// })
// app.get('/ml/settings', (req, res) => {
//   res.render('settings')
// })