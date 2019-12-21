const path = require('path');
const auth = require('../controllers/auth.js'); // Used to access the methods within controller

module.exports = function (app) { // By declaring as a function we can access each route individually
  app.get('/', function (req, res) {
    auth.home(req, res);
  });
  // app.all("*", (req, res, next) => {
  //   res.sendFile(path.resolve("./public/dist/public/index.html"))
  // });
}



// Routes
// app.get('/', (req, res) => {
//   res.render('index')
// })
// app.get('/ml/dashboard', (req, res) => {
//   res.render('dashboard')
// })
// app.get('/ml/history', (req, res) => {
//   res.render('history')
// })
// app.get('/ml/settings', (req, res) => {
//   res.render('settings')
// })
// app.get('/login', (req, res) => {
//   res.render('signin')
// })
// app.get('/signup', (req, res) => {
//   res.render('signup')
// })