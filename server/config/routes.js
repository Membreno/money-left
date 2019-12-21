const path = require('path');
const auth = require('../controllers/auth.js'); // Used to access the methods within controller

module.exports = function (app) { // By declaring as a function we can access each route individually
  app.get('/', function (req, res) {
    console.log('IN HOME ROUTE');
    auth.home(req, res);
  });
  // app.all("*", (req, res, next) => {
  //   res.sendFile(path.resolve("./public/dist/public/index.html"))
  // });
}