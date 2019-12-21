const path = require('path');
const base = require('../controllers/base.js'); // Used to access the methods within controller
const authorize = require('../controllers/authorize.js');

module.exports = function (app) { // By declaring as a function we can access each route individually
  app.get('/', function (req, res) {
    base.home(req, res);
  });
  app.get('/signup', function (req, res) {
    base.signup(req, res);
  });
  app.get('/login', function (req, res) {
    base.login(req, res);
  });
  app.post('/signup', function(req, res) {
    authorize.register(req, res);
  })
  // app.all("*", (req, res, next) => {
  //   res.sendFile(path.resolve("./public/dist/public/index.html"))
  // });
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